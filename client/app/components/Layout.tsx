"use client"

import Image from "next/image";
import Summary from "./Summary";
import { LayoutProps } from "../types/props";
import { Poppins } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { ThemeType } from "../types/theme";
import { generatePdf } from "../libs/generatePdf";
import Error from "./Error";
import SelectFeatures from "./SelectFeatures";
import { translate } from "../libs/translateText";
import { useAuth } from "../contexts/AuthContext";
import { handleError } from "../libs/handleError";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Layout({
  title1,
  title2,
  subtitle,
  imageUrl,
  response,
  questions,
  imageBuffer,
  url,
  setQuestions,
  setResponse,
  setUrl,
  setFileUrl,
  handleSubmit,
  isModalOpen,
  setIsModalOpen,
  type,
  errorMessage,
  setSelectedFeatures,
  selectedFeatures,
  isSubmitting,
}: LayoutProps) {
  const { user } = useAuth();
  const [pdfTheme, setPdfTheme] = useState("default");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [cachedPdfs, setCachedPdfs] = useState<ThemeType>({
    default: null,
    dark: null,
  });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const originalRef = useRef({ summary: "", questions: "" });
  const token = user?.token ?? 0;

  useEffect(() => {
    if (isSubmitting) {
      setSelectedLanguage("en");
      originalRef.current = { summary: "", questions: "" };
      setCachedPdfs({ default: null, dark: null });
      setPreviewPdfUrl(null);
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (response && selectedLanguage === "en") {
      originalRef.current = { summary: response, questions };
    }
  }, [response, questions, selectedLanguage]);

  const handleThemeChange = (theme: string) => {
    setPdfTheme(theme);
    if (cachedPdfs[theme]) {
      setPreviewPdfUrl(cachedPdfs[theme]);
    } else if (response) {
      generatePdf(response, questions, imageBuffer, theme, setCachedPdfs, setPreviewPdfUrl);
    }
  };

  async function handleLanguageChange(language: string) {
    if (!selectedFeatures.includes("Translation Options")) return;
    if (language === "en") {
      setResponse(originalRef.current.summary || response);
      setQuestions(originalRef.current.questions || questions);
      return;
    }
    const sourceSummary = originalRef.current.summary || response;
    const sourceQuestions = originalRef.current.questions || questions;
    const translatedSummary = await translate(language, sourceSummary);
    const translatedQuestions = sourceQuestions
      ? await translate(language, sourceQuestions)
      : "";
    if (!translatedSummary) {
      handleError("Translation failed. Please try again.");
      return;
    }
    setResponse(translatedSummary);
    setQuestions(translatedQuestions);
  }

  return (
  <div id={type === 1 ? "video" : "notes"} className={`min-h-screen w-screen bg-black overflow-x-hidden flex ${type === 2 ? 'my-0' : 'my-24'} flex-col md:flex-row`}>
    {type === 2 ? (
      <>
        <div className="w-full md:w-2/5 min-h-[280px] md:h-auto flex items-center justify-center relative mt-8 md:mt-0 md:ml-14">
          <Image
            style={{ transform: 'scale(115%)' }}
            fill
            src={imageUrl}
            alt="Background"
            className="object-contain max-h-full max-w-full"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <h1 className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}>
            {title1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
              {title2}
            </span>
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
            {subtitle}
          </p>
          <input
            type="file"
            accept="application/pdf"
            id="url"
            onChange={(e) => {if (setFileUrl) setFileUrl(e.target.files?.[0] ?? null)}}
            className="w-full mt-16 md:w-1/2 bg-transparent text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
          />
          <Error message={errorMessage} />
          <SelectFeatures
            token={token}
            setSelectedFeatures={setSelectedFeatures}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full md:w-1/5 mr-4 font-bold bg-white text-black px-2 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Summarizing…" : "Summarize"}
          </button>
        </form>
      </>
    ) : (
      <>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <h1 className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}>
            {title1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
              {title2}
            </span>
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
            {subtitle}
          </p>
          <input
            placeholder="Paste a YouTube link…"
            type="text"
            id="url"
            value={url ? url : ""}
            onChange={(e) => { if (setUrl) setUrl(e.target.value)}}
            className="w-full md:w-1/2 mt-16 bg-transparent placeholder:text-white/50 text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
          />
          <Error message={errorMessage} />
          <SelectFeatures
            token={token}
            setSelectedFeatures={setSelectedFeatures}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full md:w-1/5 mr-4 font-bold bg-white text-black px-2 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Summarizing…" : "Summarize"}
          </button>
        </form>
        <div className="w-full md:w-2/5 min-h-[280px] md:min-h-[520px] flex items-center justify-center relative mt-8 md:mt-0 md:ml-14">
          <Image
            style={{ transform: 'scale(115%)' }}
            fill
            src={imageUrl}
            alt="Background"
            className="object-contain max-h-full max-w-full"
          />
        </div>
      </>
    )}
    <Summary
      isOpen={isModalOpen}
      closeModal={() => setIsModalOpen(false)}
      summary={response}
      questions={questions}
      loading={!!isSubmitting}
      imageBuffer={imageBuffer}
      pdfUrl={previewPdfUrl}
      handleThemeChange={handleThemeChange}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      generatePdf={generatePdf}
      pdfTheme={pdfTheme}
      setCachedPdfs={setCachedPdfs}
      setPreviewPdfUrl={setPreviewPdfUrl}
      handleLanguageChange={handleLanguageChange}
      selectedFeatures={selectedFeatures}
    />
  </div>
);
}
