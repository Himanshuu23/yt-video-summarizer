"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { SummaryProps } from "../types/props";
import Loading from "./Loading";
import Speech from "./Speech";
import PdfOptions from "./PdfOptions";
import Text from "./Text";
import { toImageSrc } from "../libs/apiError";

export default function Summary({
  isOpen,
  closeModal,
  summary,
  questions,
  loading,
  imageBuffer,
  pdfUrl,
  handleThemeChange,
  selectedLanguage,
  setSelectedLanguage,
  generatePdf,
  pdfTheme,
  setCachedPdfs,
  setPreviewPdfUrl,
  handleLanguageChange,
  selectedFeatures,
}: SummaryProps) {
  const [languages, setLanguages] = useState<Record<string, string>>({});
  const canTranslate = selectedFeatures.includes("Translation Options");
  const canShowQuestions = selectedFeatures.includes("Questions & Answers");
  const canShowDiagram = selectedFeatures.includes("Flowchart & Diagrams");
  const imageSrc = canShowDiagram ? toImageSrc(imageBuffer) : null;

  function changeLanguage(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setSelectedLanguage(next);
    handleLanguageChange(next);
  }

  useEffect(() => {
    fetch("/languages.json")
      .then((res) => res.json())
      .then((json) => setLanguages(json));
  }, []);

  if (!isOpen) return null;

  return (
    <aside
      className="fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-full md:w-[min(42rem,46vw)] bg-neutral-950/95 border-l border-white/10 shadow-2xl overflow-y-auto backdrop-blur-md"
      role="dialog"
      aria-label="Summary"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 bg-neutral-950/90 border-b border-white/10">
        <div className="flex items-center gap-1 min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">Summary</h2>
          {summary && (
            <Speech
              summary={summary}
              questions={canShowQuestions ? questions : ""}
              selectedLanguage={selectedLanguage}
            />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canTranslate && summary && (
            <select
              value={selectedLanguage}
              onChange={changeLanguage}
              className="bg-black border border-white/20 rounded-md font-light text-white text-sm w-32 px-2 py-1"
            >
              {Object.entries(languages).map(([language, code]) => (
                <option key={code} value={code}>
                  {language}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={closeModal}
            className="p-2 text-white/70 hover:text-white text-2xl leading-none"
            aria-label="Close summary"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 text-white">
        {loading || !summary ? (
          <Loading message="Generating your notes…" />
        ) : (
          <div className="flex flex-col space-y-8">
            <Text
              summary={summary}
              questions={canShowQuestions ? questions : ""}
              imageSrc={imageSrc}
            />
            <PdfOptions
              pdfTheme={pdfTheme}
              setCachedPdfs={setCachedPdfs}
              setPreviewPdfUrl={setPreviewPdfUrl}
              summary={summary}
              questions={canShowQuestions ? questions : ""}
              imageBuffer={imageBuffer}
              pdfUrl={pdfUrl}
              generatePdf={generatePdf}
              handleThemeChange={handleThemeChange}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
