import type { ChangeEvent } from "react";
interface UploadLabelProps {
  onFileSelect: (file: File) => void;
}

function UploadLabel({
  onFileSelect,
}: UploadLabelProps) {
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      alert("Please select a PDF file.");
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="rounded-2xl border border-[#e1e1e9] bg-white p-6 text-center shadow-[0_2px_8px_rgba(30,30,60,0.025)]">

      <h2 className="m-0 text-[16px] font-bold text-[#26262f]">
        Upload Shipping Labels
      </h2>

      <label className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-[10px] bg-[#6955e8] px-[18px] text-[13.5px] font-semibold text-white shadow-[0_3px_8px_rgba(105,85,232,0.15)] transition-colors hover:bg-[#5e4bdd]">

        Choose PDF

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          hidden
        />

      </label>

      <p className="mt-3 mb-0 text-[12px] text-[#74798b]">
        Upload your shipping label PDF
      </p>

    </div>
  );
}

export default UploadLabel;