"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SummaryProps } from "../types/summary";

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
}: SummaryProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [languages, setLanguages] = useState({});
  const [typedSummary, setTypedSummary] = useState("");
  const [typedQuestions, setTypedQuestions] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorVisibleQ, setCursorVisibleQ] = useState(true);

  useEffect(() => {
    if (!summary || typeof summary !== "string" || summary.length === 0) {
      setTypedSummary("");
      setCursorVisible(false);
      return;
    }

    let i = 0;
    setTypedSummary(""); // Reset the text
    setCursorVisible(true);

    const interval = setInterval(() => {
      if (i < summary.length) {
        setTypedSummary((prev) => prev + (summary[i] || '')); // Ensure no undefined is added
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setCursorVisible(false), 500);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [summary]);

  useEffect(() => {
    if (!questions || typeof questions !== "string" || questions.length === 0) {
      setTypedQuestions("");
      setCursorVisibleQ(false);
      return;
    }

    let j = 0;
    setTypedQuestions(""); // Reset the text
    setCursorVisibleQ(true);

    const interval = setInterval(() => {
      if (j < questions.length) {
        setTypedQuestions((prev) => prev + (questions[j] || '')); // Ensure no undefined is added
        j++;
      } else {
        clearInterval(interval);
        setTimeout(() => setCursorVisibleQ(false), 500);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [questions]);

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

  const handlePdf = () => {
    generatePdf(summary, questions, imageBuffer);
    setIsPdfVisible(true);
  };

  useEffect(() => {
    fetch("/languages.json")
      .then((res) => res.json())
      .then((json) => setLanguages(json));
  }, []);

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
            <p className="text-sm leading-relaxed">
              {summary? typedSummary : "Generating the summary..."}
              {cursorVisible && summary && (
                <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-blink"></span>
              )}
            </p>
            <h2>Questions & Answers</h2>
            <p className="text-sm leading-relaxed">
              {questions? typedQuestions : "Generating Questions for you..."}
              {cursorVisibleQ && questions && (
                <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-blink"></span>
              )}
            </p>
            <div className="flex flex-col items-center">
              <p className="text-sm mb-2">Want to download the notes?</p>
              <button
                onClick={handlePdf}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isPdfVisible ? "Regenerate PDF" : "Generate PDF"}
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
          </div>
        </div>
      </div>
    )
  );
}