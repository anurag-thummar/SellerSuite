import {
    PDFDocument,
    StandardFonts,
    rgb,
    type PDFFont,
} from "pdf-lib";

import QRCode from "qrcode";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import footerTemplate from "../assets/footer-template-bw.png";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFInfo {
    pageCount: number;
    fileName: string;
    shopName: string;
}

function formatCustomerName(
    customerName: string
): string {
    const trimmedName = customerName.trim();

    if (!trimmedName) {
        return "";
    }

    return (
        trimmedName.charAt(0).toUpperCase() +
        trimmedName.slice(1).toLowerCase()
    );
}

async function extractCustomerNameFromPage(
    page: any,
    pageNumber: number
): Promise<string> {
    const textContent =
        await page.getTextContent();

    const items = textContent.items
        .map((item: any) =>
            typeof item.str === "string"
                ? item.str.trim()
                : ""
        )
        .filter(Boolean);

    for (
        let i = 0;
        i < items.length;
        i++
    ) {
        const currentText =
            items[i]
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

        if (
            currentText ===
            "customer address"
        ) {
            for (
                let j = i + 1;
                j < items.length;
                j++
            ) {
                const customerName =
                    items[j]
                        .replace(/\s+/g, " ")
                        .trim();

                if (!customerName) {
                    continue;
                }

                console.log(
                    "Customer name detected:",
                    {
                        page: pageNumber,
                        customer: customerName,
                    }
                );

                return customerName;
            }
        }
    }

    return "";
}

export async function extractCustomerNamesFromPDF(
    file: File
): Promise<string[]> {
    try {
        const arrayBuffer =
            await file.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({
                data: arrayBuffer,
                disableWorker: true,
            }).promise;

        const customerNames: string[] = [];

        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {
            const page =
                await pdf.getPage(
                    pageNumber
                );

            const customerName =
                await extractCustomerNameFromPage(
                    page,
                    pageNumber
                );

            customerNames.push(
                customerName
            );
        }

        return customerNames;
    } catch (error) {
        console.error(
            "Customer names extraction error:",
            error
        );

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unable to detect customer names."
        );
    }
}

export async function extractCustomerNameFromPDF(
    file: File
): Promise<string> {
    const customerNames =
        await extractCustomerNamesFromPDF(
            file
        );

    return customerNames[0] ?? "";
}

export async function extractShopNameFromPDF(
    file: File
): Promise<string> {
    try {
        const arrayBuffer =
            await file.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({
                data: arrayBuffer,
                disableWorker: true,
            }).promise;

        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {
            const page =
                await pdf.getPage(
                    pageNumber
                );

            const textContent =
                await page.getTextContent();

            const items =
                textContent.items
                    .map((item: any) =>
                        typeof item.str === "string"
                            ? item.str.trim()
                            : ""
                    )
                    .filter(Boolean);

            for (
                let i = 0;
                i < items.length;
                i++
            ) {
                const currentText =
                    items[i]
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase();

                if (
                    currentText ===
                    "if undelivered, return to:"
                ) {
                    for (
                        let j = i + 1;
                        j < items.length;
                        j++
                    ) {
                        const possibleShopName =
                            items[j]
                                .replace(/\s+/g, " ")
                                .trim();

                        if (
                            !possibleShopName
                        ) {
                            continue;
                        }

                        const isUppercase =
                            possibleShopName ===
                            possibleShopName.toUpperCase();

                        const containsLetters =
                            /[A-Z]/.test(
                                possibleShopName
                            );

                        if (
                            isUppercase &&
                            containsLetters
                        ) {
                            console.log(
                                "Shop name detected:",
                                {
                                    page: pageNumber,
                                    shop: possibleShopName,
                                }
                            );

                            return possibleShopName;
                        }
                    }
                }
            }
        }

        throw new Error(
            'Shop name not found after "If undelivered, return to:"'
        );
    } catch (error) {
        console.error(
            "Shop name extraction error:",
            error
        );

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unable to detect shop name."
        );
    }
}

export async function getPDFInfo(
    file: File
): Promise<PDFInfo> {
    try {
        if (file.size === 0) {
            throw new Error(
                "The selected PDF file is empty."
            );
        }

        const arrayBuffer =
            await file.arrayBuffer();

        const pdfDoc =
            await PDFDocument.load(
                arrayBuffer
            );

        const pageCount =
            pdfDoc.getPageCount();

        const shopName =
            await extractShopNameFromPDF(
                file
            );

        return {
            pageCount,
            fileName: file.name,
            shopName,
        };
    } catch (error) {
        console.error(
            "PDF info error:",
            error
        );

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unable to read PDF information."
        );
    }
}

export async function addFooterToPDF(
    file: File,
    shopUrl: string,
    thankYouBeforeName: string,
    thankYouAfterName: string,
    footerLine1: string,
    footerLine2: string,
    thankYouBold: boolean,
    thankYouItalic: boolean,
    thankYouFontSize: number,
    thankYouUnderline: boolean
): Promise<Uint8Array> {
    try {
        const arrayBuffer =
            await file.arrayBuffer();

        const pdfDoc =
            await PDFDocument.load(
                arrayBuffer
            );

        const pages =
            pdfDoc.getPages();

        const BLACK = rgb(0, 0, 0);

        const shopName =
            await extractShopNameFromPDF(
                file
            );

        const customerNames =
            await extractCustomerNamesFromPDF(
                file
            );

        const footerBytes =
            await fetch(
                footerTemplate
            ).then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Unable to load footer template."
                    );
                }

                return response.arrayBuffer();
            });

        const footerImage =
            await pdfDoc.embedPng(
                footerBytes
            );

        if (!shopUrl.trim()) {
            throw new Error(
                "Shop URL is required to generate QR code."
            );
        }

        const qrDataUrl =
            await QRCode.toDataURL(
                shopUrl,
                {
                    width: 600,
                    margin: 0,
                    errorCorrectionLevel: "H",
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                }
            );

        const qrBase64 =
            qrDataUrl.split(",")[1];

        if (!qrBase64) {
            throw new Error(
                "Unable to generate QR code."
            );
        }

        const qrBytes =
            Uint8Array.from(
                atob(qrBase64),
                (char) =>
                    char.charCodeAt(0)
            );

        const qrImage =
            await pdfDoc.embedPng(
                qrBytes
            );

        const regularFont =
            await pdfDoc.embedFont(
                StandardFonts.Helvetica
            );

        const boldFont =
            await pdfDoc.embedFont(
                StandardFonts.HelveticaBold
            );

        const italicFont =
            await pdfDoc.embedFont(
                StandardFonts.HelveticaOblique
            );

        const boldItalicFont =
            await pdfDoc.embedFont(
                StandardFonts.HelveticaBoldOblique
            );

        let thankYouFont: PDFFont;

        if (
            thankYouBold &&
            thankYouItalic
        ) {
            thankYouFont =
                boldItalicFont;
        } else if (thankYouBold) {
            thankYouFont =
                boldFont;
        } else if (thankYouItalic) {
            thankYouFont =
                italicFont;
        } else {
            thankYouFont =
                regularFont;
        }

        const safeThankYouFontSize =
            Math.min(
                30,
                Math.max(
                    10,
                    thankYouFontSize
                )
            );

        const beforeName =
            thankYouBeforeName.trim();

        const afterName =
            thankYouAfterName.trim();

        const beforeNameText =
            beforeName
                ? `${beforeName} `
                : "";

        const afterNameText =
            afterName
                ? ` ${afterName}`
                : "";

        for (
            let pageIndex = 0;
            pageIndex < pages.length;
            pageIndex++
        ) {
            const page =
                pages[pageIndex];

            const {
                width: pageWidth,
            } = page.getSize();

            const footerWidth = 445;

            const footerHeight =
                footerWidth *
                (182 / 946);

            const footerX =
                (pageWidth -
                    footerWidth) /
                2;

            const footerY = 9.5;

            const thankYouY =
                footerY +
                footerHeight +
                7;

            const rawCustomerName =
                customerNames[
                pageIndex
                ] ?? "";

            const formattedCustomerName =
                formatCustomerName(
                    rawCustomerName
                );

            page.drawImage(
                footerImage,
                {
                    x: footerX,
                    y: footerY,
                    width: footerWidth,
                    height: footerHeight,
                }
            );

            const shopNameFontSize =
                footerHeight * 0.17;

            const shopNameUnderText =
                footerHeight * 0.1525;

            page.drawText(
                shopName,
                {
                    x:
                        footerX +
                        footerWidth * 0.188,
                    y:
                        footerY +
                        footerHeight * 0.64,
                    size: shopNameFontSize,
                    font: boldFont,
                    color: BLACK,
                }
            );

            if (footerLine1.trim()) {
                page.drawText(
                    footerLine1.trim(),
                    {
                        x:
                            footerX +
                            footerWidth * 0.188,
                        y:
                            footerY +
                            footerHeight * 0.43,
                        size: shopNameUnderText,
                        font: boldFont,
                        color: BLACK,
                    }
                );
            }

            if (footerLine2.trim()) {
                page.drawText(
                    footerLine2.trim(),
                    {
                        x:
                            footerX +
                            footerWidth * 0.188,
                        y:
                            footerY +
                            footerHeight * 0.25,
                        size: shopNameUnderText,
                        font: boldFont,
                        color: BLACK,
                    }
                );
            }

            const qrSize =
                footerHeight * 0.70;

            const qrX =
                footerX +
                footerWidth * 0.585;

            const qrY =
                footerY +
                footerHeight * 0.15;

            page.drawImage(
                qrImage,
                {
                    x: qrX,
                    y: qrY,
                    width: qrSize,
                    height: qrSize,
                }
            );

            const customerNameFont =
                boldItalicFont;

            const beforeNameWidth =
                thankYouFont.widthOfTextAtSize(
                    beforeNameText,
                    safeThankYouFontSize
                );

            const customerNameWidth =
                formattedCustomerName
                    ? customerNameFont.widthOfTextAtSize(
                        formattedCustomerName,
                        safeThankYouFontSize
                    )
                    : 0;

            const afterNameWidth =
                thankYouFont.widthOfTextAtSize(
                    afterNameText,
                    safeThankYouFontSize
                );

            const totalTextWidth =
                beforeNameWidth +
                customerNameWidth +
                afterNameWidth;

            const startX =
                (pageWidth -
                    totalTextWidth) /
                2;

            let currentX =
                startX;

            if (beforeNameText) {
                page.drawText(
                    beforeNameText,
                    {
                        x: currentX,
                        y: thankYouY,
                        size:
                            safeThankYouFontSize,
                        font:
                            thankYouFont,
                        color: BLACK,
                    }
                );

                currentX +=
                    beforeNameWidth;
            }

            if (formattedCustomerName) {
                const customerNameX =
                    currentX;

                page.drawText(
                    formattedCustomerName,
                    {
                        x: customerNameX,
                        y: thankYouY,
                        size:
                            safeThankYouFontSize,
                        font:
                            customerNameFont,
                        color: BLACK,
                    }
                );

                if (
                    thankYouUnderline
                ) {
                    page.drawLine({
                        start: {
                            x:
                                customerNameX,
                            y:
                                thankYouY -
                                1.8,
                        },
                        end: {
                            x:
                                customerNameX +
                                customerNameWidth,
                            y:
                                thankYouY -
                                1.8,
                        },
                        thickness: 0.75,
                        color: BLACK,
                    });
                }

                currentX +=
                    customerNameWidth;
            }

            if (afterNameText) {
                page.drawText(
                    afterNameText,
                    {
                        x: currentX,
                        y: thankYouY,
                        size:
                            safeThankYouFontSize,
                        font:
                            thankYouFont,
                        color: BLACK,
                    }
                );
            }
        }

        return await pdfDoc.save();
    } catch (error) {
        console.error(
            "Add footer error:",
            error
        );

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unable to add footer to PDF."
        );
    }
}