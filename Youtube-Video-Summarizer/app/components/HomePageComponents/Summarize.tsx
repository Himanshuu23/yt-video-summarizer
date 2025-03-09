import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Summary from "../Summary";
import { ThemeType } from "@/app/types/theme";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Summarize = forwardRef<HTMLDivElement>((props, ref) => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<string>("");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [pdfTheme, setPdfTheme] = useState("default");
  const [cachedPdfs, setCachedPdfs] = useState<ThemeType>({
    default: null,
    dark: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("")

  async function handleSubmit(e: any) {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/summarize/url", {
      method: "POST",
      body: JSON.stringify({ videoUrl: JSON.stringify(url) }),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    setResponse(data.summary);
    setIsModalOpen(true);
  }

  async function generatePdf(response: string) {
    const res = await fetch("http://localhost:8000/pdf", {
      method: "POST",
      body: JSON.stringify({ summary: response, theme: pdfTheme }),
      headers: { "Content-type": "application/json" },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setCachedPdfs((prev) => ({ ...prev, [pdfTheme]: url }));
    setPreviewPdfUrl(url);
  }

  async function translateSummary(language: string, text: string) {
    const res = await fetch("http://localhost:8000/translate", {
      method: "POST",
      body: JSON.stringify({ text: text, lang: language }),
      headers: { "Content-type": "application/json" },
    });

    const result = await res.json()
    setResponse(result.translatedText)
    // generatePdf(response)
  }

  const handleThemeChange = (theme: string) => {
    setPdfTheme(theme);
    if (cachedPdfs[theme]) {
      setPreviewPdfUrl(cachedPdfs[theme]);
    } else if (response) {
      generatePdf(response);
    }
  };

  useEffect(() => {
    if (response && !cachedPdfs[pdfTheme]) {
      generatePdf(response);
    }
  }, [pdfTheme, response]);

  useEffect(() => {
    translateSummary(selectedLanguage, response)
  }, [selectedLanguage])

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex my-16 flex-col md:flex-row">
      <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
        <h1
          className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}
        >
          YouTube Video Summaries
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
            in a Flash
          </span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
          Generating notes in multiple themes to download in PDF format, available in multiple languages, and generating related questions for a deeper understanding.
        </p>
        <input
          placeholder="looking for a link..."
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full md:w-1/2 mt-16 bg-transparent placeholder:text-white text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full md:w-1/5 mr-4 font-bold bg-white text-black px-2 py-2 rounded"
        >
          Summarize
        </button>
      </div>
      <div className="w-full md:w-2/5 h-full flex items-center justify-center relative mt-8 md:mt-0 md:ml-14">
        <Image
          style={{transform: 'scale(115%)'}}
          fill
          src="/hero-1.png"
          alt="Background"
          className="object-contain max-h-full max-w-full"
        />
      </div>
      {response && <Summary
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        summary={response}
        pdfUrl={previewPdfUrl}
        handleThemeChange={handleThemeChange}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />}
    </div>
  );  
});

export default Summarize;