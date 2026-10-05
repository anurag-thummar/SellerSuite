import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addFooterToPDF,
  getPDFInfo,
} from "./utils/processPDF";

import ShopSettings from "./components/ShopSettings";

// ==========================================
// TYPES
// ==========================================

interface StoreAccount {
  id: number;
  url: string;
}

interface FooterTemplateSettings {
  thankYouBeforeName: string;
  thankYouAfterName: string;
  footerLine1: string;
  footerLine2: string;
  thankYouBold: boolean;
  thankYouItalic: boolean;
  thankYouUnderline: boolean;
  thankYouFontSize: number;
}

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================

const STORE_LINKS_STORAGE_KEY =
  "label-qr-store-links";

const FOOTER_TEMPLATE_STORAGE_KEY =
  "label-qr-footer-template";

// ==========================================
// DEFAULT FOOTER TEMPLATE
// ==========================================

const DEFAULT_FOOTER_TEMPLATE: FooterTemplateSettings = {
  thankYouBeforeName: "Thank you",
  thankYouAfterName: "for choosing us!",
  footerLine1: "Your Order,",
  footerLine2: "Our Happiness!",
  thankYouBold: false,
  thankYouItalic: false,
  thankYouUnderline: true,
  thankYouFontSize: 16,
};

// ==========================================
// LOAD STORE LINKS
// ==========================================

function loadStoreLinks(): StoreAccount[] {
  try {
    const savedLinks = localStorage.getItem(
      STORE_LINKS_STORAGE_KEY
    );

    if (!savedLinks) {
      return [
        {
          id: 1,
          url: "",
        },
      ];
    }

    const parsedLinks = JSON.parse(savedLinks);

    if (
      Array.isArray(parsedLinks) &&
      parsedLinks.length > 0
    ) {
      return parsedLinks.map(
        (
          account: Partial<StoreAccount>,
          index: number
        ) => ({
          id:
            typeof account.id === "number"
              ? account.id
              : Date.now() + index,
          url:
            typeof account.url === "string"
              ? account.url
              : "",
        })
      );
    }
  } catch (error) {
    console.error(
      "Error loading store links:",
      error
    );
  }

  return [
    {
      id: 1,
      url: "",
    },
  ];
}

// ==========================================
// LOAD FOOTER TEMPLATE
// ==========================================

function loadFooterTemplate(): FooterTemplateSettings {
  try {
    const savedTemplate =
      localStorage.getItem(
        FOOTER_TEMPLATE_STORAGE_KEY
      );

    if (!savedTemplate) {
      return DEFAULT_FOOTER_TEMPLATE;
    }

    const parsedTemplate =
      JSON.parse(savedTemplate);

    return {
      ...DEFAULT_FOOTER_TEMPLATE,
      ...parsedTemplate,
    };
  } catch (error) {
    console.error(
      "Error loading footer template:",
      error
    );

    return DEFAULT_FOOTER_TEMPLATE;
  }
}

// ==========================================
// APP
// ==========================================

function App() {
  // ==========================================
  // STORE ACCOUNTS
  // ==========================================

  const [accounts, setAccounts] =
    useState<StoreAccount[]>(
      loadStoreLinks
    );

  // ==========================================
  // FOOTER TEMPLATE
  // ==========================================

  const [
    thankYouBeforeName,
    setThankYouBeforeName,
  ] = useState(
    () =>
      loadFooterTemplate()
        .thankYouBeforeName
  );

  const [
    thankYouAfterName,
    setThankYouAfterName,
  ] = useState(
    () =>
      loadFooterTemplate()
        .thankYouAfterName
  );

  const [footerLine1, setFooterLine1] =
    useState(
      () =>
        loadFooterTemplate()
          .footerLine1
    );

  const [footerLine2, setFooterLine2] =
    useState(
      () =>
        loadFooterTemplate()
          .footerLine2
    );

  const [thankYouBold, setThankYouBold] =
    useState(
      () =>
        loadFooterTemplate()
          .thankYouBold
    );

  const [
    thankYouItalic,
    setThankYouItalic,
  ] = useState(
    () =>
      loadFooterTemplate()
        .thankYouItalic
  );

  const [
    thankYouUnderline,
    setThankYouUnderline,
  ] = useState(
    () =>
      loadFooterTemplate()
        .thankYouUnderline
  );

  const [
    thankYouFontSize,
    setThankYouFontSize,
  ] = useState(
    () =>
      loadFooterTemplate()
        .thankYouFontSize
  );

  // ==========================================
  // PDF STATES
  // ==========================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [pageCount, setPageCount] =
    useState<number | null>(null);

  // ==========================================
  // UI STATES
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    qrSuccessMessage,
    setQrSuccessMessage,
  ] = useState("");

  const [
    mergeSuccessMessage,
    setMergeSuccessMessage,
  ] = useState("");

  const [
    templateSuccessMessage,
    setTemplateSuccessMessage,
  ] = useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // ==========================================
  // CLEANUP PREVIEW URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ==========================================
  // ADD STORE ACCOUNT
  // ==========================================

  const handleAddAccount = () => {
    setAccounts((current) => [
      ...current,
      {
        id: Date.now(),
        url: "",
      },
    ]);

    setQrSuccessMessage("");
    setError("");
  };

  // ==========================================
  // REMOVE STORE ACCOUNT
  // ==========================================

  const handleRemoveAccount = (
    id: number
  ) => {
    setAccounts((current) => {
      const updatedAccounts =
        current.filter(
          (account) =>
            account.id !== id
        );

      // Agar last account bhi remove kar diya
      // to ek empty input hamesha available rahe
      if (updatedAccounts.length === 0) {
        return [
          {
            id: Date.now(),
            url: "",
          },
        ];
      }

      return updatedAccounts;
    });

    setQrSuccessMessage("");
    setError("");

    // Remove kiya hua saved link Local Storage
    // se bhi remove kar do
    try {
      const savedLinks =
        localStorage.getItem(
          STORE_LINKS_STORAGE_KEY
        );

      if (savedLinks) {
        const parsedLinks =
          JSON.parse(savedLinks);

        if (Array.isArray(parsedLinks)) {
          const updatedLinks =
            parsedLinks.filter(
              (account: StoreAccount) =>
                account.id !== id
            );

          if (
            updatedLinks.length > 0
          ) {
            localStorage.setItem(
              STORE_LINKS_STORAGE_KEY,
              JSON.stringify(
                updatedLinks
              )
            );
          } else {
            localStorage.removeItem(
              STORE_LINKS_STORAGE_KEY
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Error removing saved store link:",
        error
      );
    }
  };

  // ==========================================
  // URL CHANGE
  // ==========================================

  const handleUrlChange = (
    id: number,
    value: string
  ) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === id
          ? {
            ...account,
            url: value,
          }
          : account
      )
    );

    setQrSuccessMessage("");
    setError("");
  };

  // ==========================================
  // SAVE STORE LINKS
  // ==========================================

  const handleSaveLinks = () => {
    const validLinks = accounts.filter(
      (account) =>
        account.url.trim() !== ""
    );

    if (validLinks.length === 0) {
      setQrSuccessMessage("");

      setError(
        "Please add at least one store link."
      );

      return;
    }

    try {
      localStorage.setItem(
        STORE_LINKS_STORAGE_KEY,
        JSON.stringify(validLinks)
      );

      setAccounts(validLinks);

      setError("");

      setQrSuccessMessage(
        "✓ Links saved — they'll be here next time you open this page"
      );
    } catch (error) {
      console.error(
        "Error saving store links:",
        error
      );

      setQrSuccessMessage("");

      setError(
        "Unable to save store links."
      );
    }
  };

  // ==========================================
  // GENERATE QR STICKERS
  // ==========================================

  const handleGenerateQRStickers = () => {
    const validLinks = accounts.filter(
      (account) =>
        account.url.trim() !== ""
    );

    if (validLinks.length === 0) {
      setQrSuccessMessage("");

      setError(
        "Please add at least one store link."
      );

      return;
    }

    setError("");

    setQrSuccessMessage(
      `✓ ${validLinks.length} store ${validLinks.length === 1
        ? "sticker"
        : "stickers"
      } ready`
    );
  };

  // ==========================================
  // CLEAR STORE LINKS
  // ==========================================

  const handleClearLinks = () => {
    try {
      localStorage.removeItem(
        STORE_LINKS_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Error clearing store links:",
        error
      );
    }

    setAccounts([
      {
        id: Date.now(),
        url: "",
      },
    ]);

    setQrSuccessMessage("");
    setError("");
  };

  // ==========================================
  // SAVE FOOTER TEMPLATE
  // ==========================================

  const handleSaveTemplate = () => {
    const template: FooterTemplateSettings = {
      thankYouBeforeName,
      thankYouAfterName,
      footerLine1,
      footerLine2,
      thankYouBold,
      thankYouItalic,
      thankYouUnderline,
      thankYouFontSize,
    };

    try {
      localStorage.setItem(
        FOOTER_TEMPLATE_STORAGE_KEY,
        JSON.stringify(template)
      );

      setTemplateSuccessMessage(
        "✓ Template saved — your customization will be here next time"
      );

      setError("");

      // Message automatically hide after 3 seconds
      window.setTimeout(() => {
        setTemplateSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving footer template:",
        error
      );

      setTemplateSuccessMessage("");

      setError(
        "Unable to save template."
      );
    }
  };

  // ==========================================
  // HANDLE PDF FILES
  // ==========================================

  const handleFiles = async (
    files: FileList | File[]
  ) => {
    const file = Array.from(files).find(
      (item) =>
        item.type === "application/pdf" ||
        item.name
          .toLowerCase()
          .endsWith(".pdf")
    );

    if (!file) {
      setError(
        "Please select a PDF file."
      );

      return;
    }

    setSelectedFile(file);
    setPageCount(null);
    setError("");
    setMergeSuccessMessage("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    try {
      setLoading(true);

      const info =
        await getPDFInfo(file);

      setPageCount(
        info.pageCount
      );
    } catch (error) {
      console.error(
        "PDF reading error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to read this PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILE INPUT
  // ==========================================

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      handleFiles(
        event.target.files
      );
    }
  };

  // ==========================================
  // DRAG & DROP
  // ==========================================

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    if (
      event.dataTransfer.files
        .length > 0
    ) {
      handleFiles(
        event.dataTransfer.files
      );
    }
  };

  // ==========================================
  // GENERATE PDF PREVIEW
  // ==========================================

  const handleGeneratePreview =
    async () => {
      if (!selectedFile) {
        setError(
          "Please upload a PDF file first."
        );

        return;
      }

      const account =
        accounts.find(
          (item) =>
            item.url.trim() !== ""
        );

      if (!account) {
        setError(
          "Please add a store account first."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");
        setMergeSuccessMessage("");

        if (previewUrl) {
          URL.revokeObjectURL(
            previewUrl
          );

          setPreviewUrl("");
        }

        const pdfBytes =
          await addFooterToPDF(
            selectedFile,
            account.url,
            thankYouBeforeName,
            thankYouAfterName,
            footerLine1,
            footerLine2,
            thankYouBold,
            thankYouItalic,
            thankYouFontSize,
            thankYouUnderline
          );

        const arrayBuffer =
          new ArrayBuffer(
            pdfBytes.byteLength
          );

        new Uint8Array(
          arrayBuffer
        ).set(pdfBytes);

        const blob =
          new Blob(
            [arrayBuffer],
            {
              type: "application/pdf",
            }
          );

        const newPreviewUrl =
          URL.createObjectURL(
            blob
          );

        setPreviewUrl(
          newPreviewUrl
        );

        setMergeSuccessMessage(
          `Done — PDF preview generated with ${pageCount ?? 1
          } ${pageCount === 1
            ? "page"
            : "pages"
          }, ready to check.`
        );
      } catch (error) {
        console.error(
          "PDF preview error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to generate PDF preview."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownloadPDF = () => {
    if (!previewUrl) {
      setError(
        "Please generate the PDF preview first."
      );

      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.href = previewUrl;

    link.download =
      "labels-stamped-merged.pdf";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen w-full bg-[#f2f2f7] text-[#24242d]">

      <div className="mx-auto w-full max-w-[1450px] px-4 py-[18px] pb-10 sm:px-5">

        {/* ======================================
            HEADER
        ======================================= */}

        <header className="mb-5 flex min-h-[57px] items-center justify-between rounded-[17px] border border-[#e2e2eb] bg-white px-4 shadow-[0_2px_7px_rgba(30,30,60,0.025)] sm:px-7">

          <h1 className="text-[19px] font-[750] tracking-[-0.25px] text-[#25252e] sm:text-[21px]">
            Meesho QR Generator
          </h1>

          <button
            type="button"
            className="flex h-[37px] items-center gap-2 rounded-[10px] border border-[#6654ed] bg-white px-[15px] text-[13px] font-[650] text-[#6654ed] transition hover:bg-[#f8f7ff]"
          >
            <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#6654ed] text-[10px] font-extrabold text-white">
              ?
            </span>

            <span className="hidden sm:inline">
              How to Use
            </span>
          </button>

        </header>

        {/* ======================================
            MAIN GRID
        ======================================= */}

        <div className="grid grid-cols-1 items-start gap-[17px] lg:grid-cols-[minmax(0,1fr)_460px]">

          {/* ==================================
              LEFT SIDE
          ================================== */}

          <div className="min-w-0">

            {/* ==================================
                STEP 01
            ================================== */}

            <section className="mb-[17px] rounded-2xl border border-[#e1e1e9] bg-white px-[15px] py-[18px] shadow-[0_2px_8px_rgba(30,30,60,0.025)] sm:px-6 sm:py-[22px]">

              <div className="mb-[7px] flex items-center gap-3">

                <span className="flex h-5 w-[33px] shrink-0 items-center justify-center rounded-[5px] border border-[#ffafd2] bg-[#fff7fb] text-[10px] font-medium tracking-[0.2px] text-[#f34d9b]">
                  01
                </span>

                <h2 className="text-[15px] font-bold leading-[22px] text-[#26262f] sm:text-base">
                  Add your Meesho store accounts
                </h2>

              </div>

              <p className="mb-[15px] text-[13px] leading-5 text-[#74798b] sm:text-[13.5px]">
                Add a link for each store account you
                sell under. The store name is picked up
                automatically from each link. Your links
                are saved in this browser — next time
                you open this page, they'll already be
                filled in and you can go straight to
                Generate → upload PDFs.
              </p>

              {/* ==================================
                  STORE ACCOUNT LIST
              ================================== */}

              <div className="mb-[10px] w-full space-y-3">

                {accounts.map(
                  (account) => (
                    <div
                      key={account.id}
                      className="flex w-full items-center gap-3 rounded-[14px] border border-[#dedee8] bg-[#f8f8fc] p-3 sm:px-[17px] sm:py-[15px]"
                    >

                      <input
                        className="h-12 min-w-0 flex-1 rounded-[11px] border border-[#dedee8] bg-[#f9f9fc] px-[15px] font-mono text-[13px] text-[#292933] outline-none transition placeholder:text-[#a0a3b0] focus:border-[#7663ed] focus:ring-4 focus:ring-[#7663ed]/10"
                        type="url"
                        value={
                          account.url
                        }
                        placeholder="https://www.meesho.com/your-store"
                        onChange={(
                          event
                        ) =>
                          handleUrlChange(
                            account.id,
                            event
                              .target
                              .value
                          )
                        }
                      />

                      {/* REMOVE BUTTON */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveAccount(
                            account.id
                          )
                        }
                        className="h-12 shrink-0 rounded-[11px] border border-[#ffafd2] bg-[#fff7fb] px-5 text-[13.5px] font-[700] text-[#ef4d99] transition hover:border-[#ff91c0] hover:bg-[#fff0f7] active:scale-[0.98]"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>

              {/* ==================================
                  STORE BUTTONS
              ================================== */}

              <div className="flex flex-wrap items-center gap-2.5">

                <button
                  type="button"
                  onClick={
                    handleAddAccount
                  }
                  className="h-10 rounded-[10px] border border-[#dedee8] bg-[#f8f8fb] px-[18px] text-[13.5px] font-[650] text-[#292932] transition hover:bg-[#f1f1f5]"
                >
                  + Add another account
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveLinks
                  }
                  className="h-10 rounded-[10px] border border-[#dedee8] bg-[#f8f8fb] px-[18px] text-[13.5px] font-[650] text-[#292932] transition hover:bg-[#f1f1f5]"
                >
                  Save Links
                </button>

                <button
                  type="button"
                  onClick={
                    handleGenerateQRStickers
                  }
                  className="h-10 rounded-[10px] border border-[#6955e8] bg-[#6955e8] px-[18px] text-[13.5px] font-[650] text-white shadow-[0_3px_8px_rgba(105,85,232,0.15)] transition hover:bg-[#5e4bdd]"
                >
                  Generate QR Stickers
                </button>

                <button
                  type="button"
                  onClick={
                    handleClearLinks
                  }
                  className="h-10 rounded-[10px] border border-[#ffadd0] bg-[#fff7fb] px-[18px] text-[13.5px] font-[650] text-[#ef4d99] transition hover:bg-[#fff0f7]"
                >
                  Clear Links
                </button>

              </div>

              {/* SAVE MESSAGE */}

              {qrSuccessMessage && (
                <div className="mt-3 font-mono text-[13px] font-semibold leading-5 text-[#159447]">
                  {qrSuccessMessage}
                </div>
              )}

            </section>

            {/* ==================================
                STEP 02
            ================================== */}

            <section className="mb-[17px] rounded-2xl border border-[#e1e1e9] bg-white px-[15px] py-[18px] shadow-[0_2px_8px_rgba(30,30,60,0.025)] sm:px-6 sm:py-[22px]">

              <div className="mb-[7px] flex items-center gap-3">

                <span className="flex h-5 w-[33px] shrink-0 items-center justify-center rounded-[5px] border border-[#ffafd2] bg-[#fff7fb] text-[10px] font-medium tracking-[0.2px] text-[#f34d9b]">
                  02
                </span>

                <h2 className="text-[15px] font-bold leading-[22px] text-[#26262f] sm:text-base">
                  Upload all your labels
                </h2>

              </div>

              <p className="mb-[15px] text-[13px] leading-5 text-[#74798b] sm:text-[13.5px]">
                Drop in PDFs from all your store
                accounts together — the tool reads the
                "If undelivered, return to:" name on each
                label and matches it to the right account
                automatically.
              </p>

              <div
                className="flex min-h-[70px] w-full cursor-pointer flex-wrap items-center justify-center rounded-[10px] border border-dashed border-[#d9d9e4] bg-[#f9f9fc] p-3 text-center text-sm text-[#777b8d] transition hover:border-[#aaa0ef] hover:bg-[#f7f6fd]"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={
                  handleDrop
                }
              >

                <strong className="font-bold text-[#272731]">
                  Click to choose PDFs
                </strong>

                <span className="ml-1">
                  or drag &amp; drop them here — any
                  account, all at once
                </span>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={
                  handleFileInput
                }
              />

              {selectedFile && (
                <div className="mt-[11px] inline-flex items-center rounded-[5px] border border-[#dedee8] bg-[#f8f8fb] px-2.5 py-[5px] font-mono text-[11px] text-[#626678]">
                  {selectedFile.name}
                </div>
              )}

              {loading && (
                <div className="mt-2.5 text-[13px] text-[#6955e8]">
                  Reading PDF...
                </div>
              )}

              {error && (
                <div className="mt-2.5 rounded-lg border border-[#ffcaca] bg-[#fff2f2] px-3 py-[9px] text-[13px] text-[#c33b3b]">
                  {error}
                </div>
              )}

              {pageCount !==
                null && (
                  <div className="mt-2 text-xs text-[#74798b]">
                    {pageCount} PDF{" "}
                    {pageCount ===
                      1
                      ? "page"
                      : "pages"}{" "}
                    detected
                  </div>
                )}

              <div className="mt-3.5 flex min-h-[60px] items-center gap-3 rounded-[10px] border border-[#dedee8] bg-[#f8f8fc] px-3.5 py-[11px]">

                <div className="flex h-8 w-[46px] shrink-0 items-center justify-center rounded-[5px] border border-[#dedee8] bg-white">
                  <span className="h-[7px] w-4 rounded-[2px] bg-[#ee4d9b]" />
                </div>

                <p className="m-0 text-[13px] leading-[18px] text-[#73788a]">
                  Placement is fixed —
                  <strong className="font-bold text-[#292932]">
                    {" "}
                    bottom-center
                  </strong>{" "}
                  of every label, lifted slightly above
                  the bottom edge, same spot on every
                  page. No manual positioning needed.
                </p>

              </div>

            </section>

            {/* ==================================
                STEP 03
            ================================== */}

            <section className="mb-[17px] rounded-2xl border border-[#e1e1e9] bg-white px-[15px] py-[18px] shadow-[0_2px_8px_rgba(30,30,60,0.025)] sm:px-6 sm:py-[22px]">

              <div className="mb-[7px] flex items-center gap-3">

                <span className="flex h-5 w-[33px] shrink-0 items-center justify-center rounded-[5px] border border-[#ffafd2] bg-[#fff7fb] text-[10px] font-medium tracking-[0.2px] text-[#f34d9b]">
                  03
                </span>

                <h2 className="text-[15px] font-bold leading-[22px] text-[#26262f] sm:text-base">
                  Apply, merge &amp; download
                </h2>

              </div>

              <p className="mb-[15px] text-[13px] leading-5 text-[#74798b] sm:text-[13.5px]">
                Every uploaded PDF is matched to its
                store account. For orders with 2, 3, 4+
                items, the extra "continuation" pages
                that only show a second/third tax invoice
                (no label, no barcode) are dropped
                automatically — only the real
                shipping-label page is kept and stamped.
                All uploaded PDFs are then combined into
                a single merged PDF, in the same order you
                uploaded them, ready to print.
              </p>

              {/* GENERATE / DOWNLOAD */}

              <div className="mt-0.5 flex flex-wrap items-center gap-2.5">

                <button
                  type="button"
                  onClick={
                    handleGeneratePreview
                  }
                  disabled={loading}
                  className="h-10 w-[299px] rounded-[10px] border border-[#6955e8] bg-[#6955e8] px-[18px] text-[13.5px] font-[650] text-white shadow-[0_3px_8px_rgba(105,85,232,0.15)] transition hover:bg-[#5e4bdd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Generating Preview..."
                    : "Stamp, Merge and Generate PDF Preview"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleDownloadPDF
                  }
                  className="h-10 rounded-[10px] border border-[#dedee8] bg-[#f8f8fb] px-[18px] text-[13.5px] font-[650] text-[#292932] transition hover:bg-[#f1f1f5]"
                >
                  Download PDF
                </button>

                {mergeSuccessMessage && (
                  <span className="font-mono text-[13px] font-semibold leading-5 text-[#159447]">
                    {
                      mergeSuccessMessage
                    }
                  </span>
                )}

              </div>

              {/* ==================================
                  FOOTER CUSTOMIZATION
              ================================== */}

              <ShopSettings
                thankYouBeforeName={
                  thankYouBeforeName
                }
                thankYouAfterName={
                  thankYouAfterName
                }
                footerLine1={
                  footerLine1
                }
                footerLine2={
                  footerLine2
                }
                thankYouBold={
                  thankYouBold
                }
                thankYouItalic={
                  thankYouItalic
                }
                thankYouFontSize={
                  thankYouFontSize
                }
                thankYouUnderline={
                  thankYouUnderline
                }
                onThankYouUnderlineChange={
                  setThankYouUnderline
                }
                onThankYouBeforeNameChange={
                  setThankYouBeforeName
                }
                onThankYouAfterNameChange={
                  setThankYouAfterName
                }
                onFooterLine1Change={
                  setFooterLine1
                }
                onFooterLine2Change={
                  setFooterLine2
                }
                onThankYouBoldChange={
                  setThankYouBold
                }
                onThankYouItalicChange={
                  setThankYouItalic
                }
                onThankYouFontSizeChange={
                  setThankYouFontSize
                }
              />

              {/* ==================================
                  SAVE TEMPLATE
              ================================== */}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#ececf2] pt-4">

                <button
                  type="button"
                  onClick={
                    handleSaveTemplate
                  }
                  className="h-10 rounded-[10px] border border-[#6955e8] bg-[#6955e8] px-[20px] text-[13.5px] font-[650] text-white shadow-[0_3px_8px_rgba(105,85,232,0.15)] transition hover:bg-[#5e4bdd] active:scale-[0.98]"
                >
                  Save Template
                </button>

                <span className="text-[12px] leading-5 text-[#858899]">
                  Save your footer customization
                  for the next time you open this page.
                </span>

              </div>

              {templateSuccessMessage && (
                <div className="mt-2.5 font-mono text-[12.5px] font-semibold leading-5 text-[#159447]">
                  {
                    templateSuccessMessage
                  }
                </div>
              )}

            </section>

          </div>

          {/* ==================================
              RIGHT SIDE PDF PREVIEW
          ================================== */}

          <aside className="lg:sticky lg:top-5">

            {previewUrl ? (

              <div className="w-full overflow-hidden rounded-xl border border-[#dedee8] bg-[#f4f4f7] shadow-[0_2px_8px_rgba(30,30,60,0.025)]">

                <div className="w-full flex min-h-12 items-center border-b border-[#dedee8] bg-white px-[15px]">

                  <div className="w-full">

                    <div className="w-full">

                      <div className="w-full flex items-center justify-center mt-3 mb-3">

                        <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#f0edff] text-[22px] font-bold text-[#6252e8]">
                          ✦
                        </span>

                        <div className="w-full flex ml-3">

                          <h3 className="m-0 text-[17px] font-bold leading-tight text-[#17152b]">
                            Print Label

                            <p className="text-[11px] leading-[1.45] text-[#77748a]">
                              Personalize the message printed on every shipping label.
                            </p>
                          </h3>

                        </div>

                      </div>

                    </div>

                    <div className="flex mt-3 mb-3 justify-between items-end">

                      <strong className="text-sm font-bold text-[#292932]">
                        PDF Preview
                      </strong>

                      <span className="text-xs text-[#7a7d8d]">
                        Check the label before downloading
                      </span>

                    </div>

                  </div>

                </div>

                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="block h-[650px] w-full border-none bg-[#333333] sm:h-[750px]"
                />

              </div>

            ) : (

              <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-[#dedee8] bg-white px-8 py-10 text-center shadow-[0_2px_8px_rgba(30,30,60,0.025)] lg:min-h-[500px]">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f3ff] text-2xl">
                  📄
                </div>

                <strong className="text-[15px] font-bold text-[#292932]">
                  PDF Preview
                </strong>

                <span className="mt-1.5 max-w-[260px] text-xs leading-5 text-[#7a7d8d]">
                  Generate a preview to see your
                  processed labels here.
                </span>

              </div>

            )}

          </aside>

        </div>
      </div>
    </main>
  );
}

export default App;