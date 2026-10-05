import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRPreviewProps {
    url: string;
}

function QRPreview({ url }: QRPreviewProps) {
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            return;
        }

        let cancelled = false;

        QRCode.toDataURL(trimmedUrl, {
            width: 180,
            margin: 2,
            errorCorrectionLevel: "H",
        })
            .then((dataUrl) => {
                if (!cancelled) {
                    setQrCode(dataUrl);
                }
            })
            .catch((error) => {
                console.error("QR generation error:", error);

                if (!cancelled) {
                    setQrCode("");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    if (!url.trim()) {
        return (
            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-[#dcdce5] bg-[#fafafa] p-6 text-center">
                <div>
                    <div className="mb-2 text-3xl">🔗</div>

                    <p className="text-sm font-semibold text-[#555]">
                        Enter a store URL
                    </p>

                    <p className="mt-1 text-xs text-[#999]">
                        QR preview will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-[#e3e3eb] bg-white p-5">
            {qrCode ? (
                <>
                    <img
                        src={qrCode}
                        alt="QR Code Preview"
                        className="h-[180px] w-[180px]"
                    />

                    <p className="mt-3 max-w-[260px] truncate text-xs text-[#777]">
                        {url}
                    </p>
                </>
            ) : (
                <div className="text-sm text-[#777]">
                    Generating QR code...
                </div>
            )}
        </div>
    );
}

export default QRPreview;