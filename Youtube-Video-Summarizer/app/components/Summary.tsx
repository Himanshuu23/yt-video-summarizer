"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SummaryProps } from "../types/summary";
import Loading from "./Loading";

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
    setTypedSummary("");
    setCursorVisible(true);

    const interval = setInterval(() => {
      if (i < summary.length) {
        setTypedSummary((prev) => prev + (summary[i] || ""));
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
    setTypedQuestions("");
    setCursorVisibleQ(true);

    const interval = setInterval(() => {
      if (j < questions.length) {
        setTypedQuestions((prev) => prev + (questions[j] || ""));
        j++;
      } else {
        clearInterval(interval);
        setTimeout(() => setCursorVisibleQ(false), 500);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [questions]);

  const speakText = (text: string) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.lang.startsWith(selectedLanguage)) || voices[0];

    return utterance;
  };

  const speak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!summary && !questions) return;

    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const speech1 = speakText(summary);
    const speech2 = speakText(`Questions and Answers! ${questions}`);

    if (speech1 && speech2) {
      speech1.onend = () => window.speechSynthesis.speak(speech2);
      speech2.onend = () => setIsPlaying(false);

      window.speechSynthesis.speak(speech1);
    } else {
      setIsPlaying(false);
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
    isOpen ? (
      summary.length >= 5 ? (
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
                    onClick={speak}
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
                {typedSummary}
                {cursorVisible && summary && (
                  <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-blink"></span>
                )}
              </p>
              <h2>Questions & Answers</h2>
              <p className="text-sm leading-relaxed">
                {typedQuestions}
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
      ) : <Loading />
    ) : null
  );  
}