"use client";

import React, { useEffect, useState } from "react";
import { SummaryProps } from "../types/props";
import Loading from "./Loading";
import Speech from "./Speech";
import PdfOptions from "./PdfOptions";
import Text from "./Text";

export default function Summary({
  isOpen,
  closeModal,
  summary,
  questions,
  imageBuffer,
  pdfUrl,
  handleThemeChange,
  selectedLanguage,
  setSelectedLanguage,
  generatePdf,
  pdfTheme, 
  setCachedPdfs,
  setPreviewPdfUrl
}: SummaryProps) {
  
  const [languages, setLanguages] = useState({});

  useEffect(() => {
    fetch("/languages.json")
      .then((res) => res.json())
      .then((json) => setLanguages(json));
  }, []);

  return (
    isOpen ? (
      summary ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-black bg-opacity-90 text-white p-8 rounded-xl w-[90vw] md:w-[80vw] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute p-2 top-2 right-4 text-white text-2xl"
            >
              &times;
            </button>
            <div className="flex flex-col space-y-6">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  Summary
                  <Speech summary={summary} questions={questions} selectedLanguage={selectedLanguage} />
                </div>
                <select
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-black font-light text-white w-32 mr-8"
                >
                  {languages &&
                    Object.entries(languages as [string, string]).map(
                      ([language, code]) => (
                        <option key={code} value={code} selected={code === "en"}>
                          {language}
                        </option>
                      )
                    )}
                </select>
              </h2>
              <Text summary={summary} questions={questions} />
              <PdfOptions pdfTheme={pdfTheme} setCachedPdfs={setCachedPdfs} setPreviewPdfUrl={setPreviewPdfUrl} summary={summary} questions={questions} imageBuffer={imageBuffer} pdfUrl={pdfUrl} generatePdf={generatePdf} handleThemeChange={handleThemeChange} />
            </div>
          </div>
        </div>
      ) : <Loading />
    ) : null
  );  
}