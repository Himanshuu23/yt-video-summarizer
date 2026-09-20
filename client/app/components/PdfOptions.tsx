"use client"

import { useState } from "react";
import { PdfOptionsProps } from "../types/props";

export default function PdfOptions({ summary, questions, imageBuffer, pdfUrl, generatePdf, handleThemeChange, pdfTheme, setCachedPdfs, setPreviewPdfUrl }: PdfOptionsProps) {
    const [isPdfVisible, setIsPdfVisible] = useState(false);
    const [busy, setBusy] = useState(false);

    const handlePdf = async () => {
        if (busy) return;
        setBusy(true);
        try {
          await generatePdf(summary, questions, imageBuffer ?? "", pdfTheme, setCachedPdfs, setPreviewPdfUrl);
          setIsPdfVisible(true);
        } finally {
          setBusy(false);
        }
    };

    return (
        <>
        <div className="flex flex-col items-center">
                <p className="text-sm mb-2">Want to download the notes?</p>
                <button
                  onClick={handlePdf}
                  disabled={busy}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                >
                  {busy ? "Generating…" : isPdfVisible ? "Regenerate PDF" : "Generate PDF"}
                </button>
              </div>
              {isPdfVisible && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">PDF Options</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleThemeChange("default")}
                      className="px-4 py-2 bg-gray-300 text-black rounded"
                    >
                      Light Theme
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className="px-4 py-2 bg-gray-800 text-white rounded"
                    >
                      Dark Theme
                    </button>
                  </div>
                </div>
              )}
              {isPdfVisible && pdfUrl && (
                <div>
                  <h3 className="text-lg font-semibold">PDF Preview</h3>
                  <iframe
                    src={pdfUrl}
                    style={{ width: "100%", height: "300px", border: "none" }}
                    title="PDF Preview"
                  />
                </div>
              )}
        </>
    )
}