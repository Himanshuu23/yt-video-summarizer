"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SummaryProps } from "../types/summary";

export default function Summary({
  isOpen,
  closeModal,
  summary,
  pdfUrl,
  handleThemeChange,
  selectedLanguage,
  setSelectedLanguage
}:SummaryProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [languages, setLanguages] = useState({})

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (!speech) {
        const newSpeech = new SpeechSynthesisUtterance(summary);
        newSpeech.onend = () => setIsPlaying(false);
        setSpeech(newSpeech);
      }
      if (speech) window.speechSynthesis.speak(speech);
      setIsPlaying(true);
    }
  };

  const togglePdfVisibility = () => {
    setIsPdfVisible(!isPdfVisible);
  };

  useEffect(() => {
    fetch('/languages.json')
    .then((res) => res.json())
    .then((json) => setLanguages(json))
  })

  return (
    isOpen && (
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
            <div>
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                Summary
              <button
                onClick={toggleSpeech}
                className="px-4 py-2 focus:outline-none rounded text-sm flex items-center justify-center"
                >
                <Image
                  src={isPlaying ? "/stop.png" : "/play.png"}
                  alt={isPlaying ? "Pause" : "Start"}
                  width={24}
                  height={24}
                  className="invert"
                />
              </button>
            </div>
                <select defaultValue={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-black font-light text-white w-32 mr-8">
                  {languages &&
                    Object.entries(languages as [string, string]).map(([language, code]) => (                    
                    code =="en"? <option selected key={code} value={code}>{language}</option>:<option key={code} value={code}>{language}</option>
                  ))}
                </select>
              </h2>
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
            {isPdfVisible && <div>
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
            </div>}
            <div>
              <button
                onClick={togglePdfVisibility}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isPdfVisible ? "Hide PDF" : "Show PDF"}
              </button>
              {isPdfVisible && pdfUrl && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
                  <iframe
                    src={pdfUrl}
                    style={{ width: "100%", height: "300px", border: "none" }}
                    title="PDF Preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}