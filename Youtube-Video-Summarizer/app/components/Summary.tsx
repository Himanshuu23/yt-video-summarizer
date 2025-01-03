"use client";

import React, { useState } from "react";

export default function Summary({
  isOpen,
  closeModal,
  summary,
  pdfUrl,
  handleThemeChange,
  handleDownload,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);

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
      if (speech)
        window.speechSynthesis.speak(speech);
      setIsPlaying(true);
    }
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
        onClick={closeModal}
      >
        <div
          className="relative bg-black bg-opacity-90 text-white p-8 rounded-xl w-[80vw] max-h-[80vh] overflow-y-auto"
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
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Summary
                <button
                  onClick={toggleSpeech}
                  className={`ml-4 px-4 py-2 bg-blue-500 text-white rounded text-sm ${
                    isPlaying ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {isPlaying ? "Stop" : "Play"}
                </button>
              </h2>
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
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
            {pdfUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
                <iframe
                  src={pdfUrl}
                  style={{ width: "100%", height: "300px", border: "none" }}
                  title="PDF Preview"
                />
                <button
                  onClick={handleDownload}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}