interface ShopSettingsProps {
    thankYouBeforeName: string;
    thankYouAfterName: string;
    thankYouUnderline: boolean;

    footerLine1: string;
    footerLine2: string;

    thankYouBold: boolean;
    thankYouItalic: boolean;
    thankYouFontSize: number;
    onThankYouUnderlineChange: (
        value: boolean
    ) => void;
    onThankYouBeforeNameChange: (value: string) => void;
    onThankYouAfterNameChange: (value: string) => void;
    onFooterLine1Change: (value: string) => void;
    onFooterLine2Change: (value: string) => void;

    onThankYouBoldChange: (value: boolean) => void;
    onThankYouItalicChange: (value: boolean) => void;
    onThankYouFontSizeChange: (value: number) => void;
}

function ShopSettings({
    thankYouBeforeName,
    thankYouAfterName,
    footerLine1,
    footerLine2,

    thankYouBold,
    thankYouItalic,
    thankYouFontSize,

    onThankYouBeforeNameChange,
    onThankYouAfterNameChange,
    onFooterLine1Change,
    onFooterLine2Change,

    onThankYouBoldChange,
    onThankYouItalicChange,
    onThankYouFontSizeChange,
}: ShopSettingsProps) {
    const previewBefore =
        thankYouBeforeName.trim() || "";

    const previewAfter =
        thankYouAfterName.trim() || "";

    const decreaseFontSize = () => {
        onThankYouFontSizeChange(
            Math.max(10, thankYouFontSize - 1)
        );
    };

    const increaseFontSize = () => {
        onThankYouFontSizeChange(
            Math.min(30, thankYouFontSize + 1)
        );
    };

    return (
        <div className="mt-[18px] overflow-hidden rounded-2xl border border-[#e4e3ed] bg-white shadow-[0_2px_10px_rgba(40,30,90,0.04)]">

            <div className="border-b border-[#eceaf4] bg-gradient-to-b from-[#faf9ff] to-white px-5 py-[18px]">
                <div className="flex items-center gap-3">

                    <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#f0edff] text-[17px] font-bold text-[#6252e8]">
                        ✦
                    </span>

                    <div>
                        <h3 className="m-0 text-[17px] font-bold leading-tight text-[#17152b]">
                            Footer Customization
                        </h3>

                        <p className="mt-1 text-[13px] leading-[1.45] text-[#77748a]">
                            Personalize the message printed on every shipping label.
                        </p>
                    </div>

                </div>
            </div>
            <div className="px-5 pb-5 pt-[18px]">

                <div className="mb-[14px]">
                    <h4 className="m-0 text-[14px] font-bold text-[#222037]">
                        Thank You Message!
                    </h4>

                    <p className="mt-1 text-[12px] leading-[1.45] text-[#858196]">
                        Customer name is inserted automatically for each label.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">

                    <div className="min-w-0">
                        <label
                            htmlFor="thankYouBeforeName"
                            className="mb-[7px] block text-[12px] font-semibold text-[#3c394d]"
                        >
                            Before customer name
                        </label>

                        <input
                            id="thankYouBeforeName"
                            type="text"
                            value={thankYouBeforeName}
                            onChange={(event) =>
                                onThankYouBeforeNameChange(
                                    event.target.value
                                )
                            }
                            placeholder="Thank you"
                            autoComplete="off"
                            className="h-[42px] w-full rounded-[9px] border border-[#dddbe8] bg-white px-[13px] text-[13px] text-[#242137] outline-none transition-all placeholder:text-[#aaa7b7] hover:border-[#c9c5d8] hover:bg-[#fdfcff] focus:border-[#6957e8] focus:bg-white focus:ring-[3px] focus:ring-[#6957e8]/10"
                        />

                        <span className="mt-1.5 block text-[11px] leading-[1.4] text-[#9793a6]">
                            Text printed before the customer name.
                        </span>
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="thankYouAfterName"
                            className="mb-[7px] block text-[12px] font-semibold text-[#3c394d]"
                        >
                            After customer name
                        </label>

                        <input
                            id="thankYouAfterName"
                            type="text"
                            value={thankYouAfterName}
                            onChange={(event) =>
                                onThankYouAfterNameChange(
                                    event.target.value
                                )
                            }
                            placeholder="for shopping with us!"
                            autoComplete="off"
                            className="h-[42px] w-full rounded-[9px] border border-[#dddbe8] bg-white px-[13px] text-[13px] text-[#242137] outline-none transition-all placeholder:text-[#aaa7b7] hover:border-[#c9c5d8] hover:bg-[#fdfcff] focus:border-[#6957e8] focus:bg-white focus:ring-[3px] focus:ring-[#6957e8]/10"
                        />

                        <span className="mt-1.5 block text-[11px] leading-[1.4] text-[#9793a6]">
                            Text printed after the customer name.
                        </span>
                    </div>

                </div>

                <div className="mt-[14px] rounded-[10px] border border-[#e9e6f5] bg-[#faf9ff] p-3">

                    <div className="mb-2 flex items-center justify-between gap-3">

                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.65px] text-[#817c96]">
                                Text Formatting
                            </div>

                            <div className="mt-0.5 text-[11px] text-[#9793a6]">
                                Applies to the Thank You message
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">

                            <button
                                type="button"
                                onClick={() =>
                                    onThankYouBoldChange(
                                        !thankYouBold
                                    )
                                }
                                aria-label="Toggle bold"
                                aria-pressed={thankYouBold}
                                className={`flex h-[34px] w-[36px] items-center justify-center rounded-[8px] border text-[14px] font-extrabold transition-all ${thankYouBold
                                    ? "border-[#6957e8] bg-[#6957e8] text-white shadow-[0_2px_5px_rgba(105,85,232,0.18)]"
                                    : "border-[#dddbe8] bg-white text-[#4c485d] hover:border-[#c9c5d8] hover:bg-[#f7f6fc]"
                                    }`}
                            >
                                B
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onThankYouItalicChange(
                                        !thankYouItalic
                                    )
                                }
                                aria-label="Toggle italic"
                                aria-pressed={thankYouItalic}
                                className={`flex h-[34px] w-[36px] items-center justify-center rounded-[8px] border text-[14px] font-semibold italic transition-all ${thankYouItalic
                                    ? "border-[#6957e8] bg-[#6957e8] text-white shadow-[0_2px_5px_rgba(105,85,232,0.18)]"
                                    : "border-[#dddbe8] bg-white text-[#4c485d] hover:border-[#c9c5d8] hover:bg-[#f7f6fc]"
                                    }`}
                            >
                                I
                            </button>
                            <span className="mx-1 h-5 w-px bg-[#ddd9e8]" />

                            <button
                                type="button"
                                onClick={decreaseFontSize}
                                disabled={thankYouFontSize <= 10}
                                aria-label="Decrease font size"
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#dddbe8] bg-white text-[16px] font-semibold text-[#4c485d] transition-all hover:border-[#c9c5d8] hover:bg-[#f7f6fc] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                −
                            </button>

                            <div className="flex h-[34px] min-w-[48px] items-center justify-center rounded-[8px] border border-[#dddbe8] bg-white px-2 font-mono text-[12px] font-semibold text-[#4c485d]">
                                {thankYouFontSize}px
                            </div>

                            <button
                                type="button"
                                onClick={increaseFontSize}
                                disabled={thankYouFontSize >= 30}
                                aria-label="Increase font size"
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#dddbe8] bg-white text-[16px] font-semibold text-[#4c485d] transition-all hover:border-[#c9c5d8] hover:bg-[#f7f6fc] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                +
                            </button>

                        </div>
                    </div>
                    <div className="mt-3 overflow-hidden rounded-[9px] border border-[#dedbe9] bg-white">

                        <div className="border-b border-[#eceaf3] bg-[#faf9ff] px-3 py-2">
                            <div className="text-[10px] font-bold uppercase tracking-[0.7px] text-[#817c96]">
                                Preview
                            </div>
                        </div>

                        <div className="flex min-h-[58px] items-center justify-center px-4 py-4 text-center">

                            <div
                                className="leading-[1.45] text-black transition-all"
                                style={{
                                    fontSize: `${thankYouFontSize}px`,
                                    fontWeight:
                                        thankYouBold
                                            ? 700
                                            : 400,
                                    fontStyle:
                                        thankYouItalic
                                            ? "italic"
                                            : "normal",
                                }}
                            >
                                <span>
                                    {previewBefore}
                                </span>

                                {previewBefore && " "}

                                <strong className="font-bold italic underline decoration-1 underline-offset-2">
                                    Customer Name
                                </strong>

                                {previewAfter && " "}

                                <span>
                                    {previewAfter}
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="border-t border-[#eceaf4] px-5 pb-5 pt-[18px]">

                <div className="mb-[14px]">
                    <h4 className="m-0 text-[14px] font-bold text-[#222037]">
                        Footer Message
                    </h4>

                    <p className="mt-1 text-[12px] leading-[1.45] text-[#858196]">
                        Customize the two lines shown below your shop name.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">

                    <div className="min-w-0">
                        <label
                            htmlFor="footerLine1"
                            className="mb-[7px] block text-[12px] font-semibold text-[#3c394d]"
                        >
                            Footer line 1
                        </label>

                        <input
                            id="footerLine1"
                            type="text"
                            value={footerLine1}
                            onChange={(event) =>
                                onFooterLine1Change(
                                    event.target.value
                                )
                            }
                            placeholder="Your Order,"
                            autoComplete="off"
                            className="h-[42px] w-full rounded-[9px] border border-[#dddbe8] bg-white px-[13px] text-[13px] text-[#242137] outline-none transition-all placeholder:text-[#aaa7b7] hover:border-[#c9c5d8] hover:bg-[#fdfcff] focus:border-[#6957e8] focus:bg-white focus:ring-[3px] focus:ring-[#6957e8]/10"
                        />

                        <span className="mt-1.5 block text-[11px] leading-[1.4] text-[#9793a6]">
                            First line below your shop name.
                        </span>
                    </div>
                    <div className="min-w-0">
                        <label
                            htmlFor="footerLine2"
                            className="mb-[7px] block text-[12px] font-semibold text-[#3c394d]"
                        >
                            Footer line 2
                        </label>

                        <input
                            id="footerLine2"
                            type="text"
                            value={footerLine2}
                            onChange={(event) =>
                                onFooterLine2Change(
                                    event.target.value
                                )
                            }
                            placeholder="Our Happiness!"
                            autoComplete="off"
                            className="h-[42px] w-full rounded-[9px] border border-[#dddbe8] bg-white px-[13px] text-[13px] text-[#242137] outline-none transition-all placeholder:text-[#aaa7b7] hover:border-[#c9c5d8] hover:bg-[#fdfcff] focus:border-[#6957e8] focus:bg-white focus:ring-[3px] focus:ring-[#6957e8]/10"
                        />

                        <span className="mt-1.5 block text-[11px] leading-[1.4] text-[#9793a6]">
                            Second line below your shop name.
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ShopSettings;