"use client"

import Image from "next/image";
import Summary from "./Summary";
import { LayoutProps } from "../types/props";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { ThemeType } from "../types/theme";
import { generatePdf } from "../libs/generatePdf";
import { translate } from "../libs/translateText";
import Error from "./Error";
import SelectFeatures from "./SelectFeatures";
import { getCookie } from "../libs/cookie";

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
  handleSubmit,
  isModalOpen,
  setIsModalOpen,
  type,
  errorMessage,
  setSelectedFeatures
}: LayoutProps) {
  const [pdfTheme, setPdfTheme] = useState("default");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [cachedPdfs, setCachedPdfs] = useState<ThemeType>({
    default: null,
    dark: null,
  });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [token, setToken] = useState<number>(100)

  const handleThemeChange = (theme: string) => {
    setPdfTheme(theme);
    if (cachedPdfs[theme]) {
      setPreviewPdfUrl(cachedPdfs[theme]);
    } else if (response) {
      generatePdf(response, questions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
    }
  };

  async function getToken() {
    const user = await getCookie("user");
    if (user) {
      const token = JSON.parse(user).token
      return token;
    }

    return 100;
  }

  useEffect(() => {
    if (response && !cachedPdfs[pdfTheme]) {
      generatePdf(response, questions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
    }
  }, [pdfTheme, response]);

  useEffect(() => {
  if (response) {
    (async () => {
      console.log(selectedLanguage)
      const translatedSummary = await translate(selectedLanguage, response);
      const translatedQuestions = await translate(selectedLanguage, questions);
      setResponse(translatedSummary);
      setQuestions(translatedQuestions);
      generatePdf(translatedSummary, translatedQuestions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
    })();
  }
}, [selectedLanguage]);

  useEffect(() => {
    getToken() 
  }, [token])

  return (
    <div id={type === 1 ? "video" : "notes"} className={`h-screen w-screen bg-black overflow-hidden flex ${type === 2 ? 'my-0' : 'my-24'} flex-col md:flex-row`}>
      {type === 2 ? (
        <>
          <div className="w-full md:w-2/5 h-full flex items-center justify-center relative mt- md:mt-0 md:ml-14">
            <Image
              style={{ transform: 'scale(115%)' }}
              fill
              src={imageUrl}
              alt="Background"
              className="object-contain max-h-full max-w-full"
            />
          </div>
          <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
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
              id="url"
              onChange={(e) => setUrl(e.target.files?.[0] || null)}
              className="w-full mt-16 md:w-1/2 mt-16 bg-transparent text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
            />
            <Error message={errorMessage} />
            <SelectFeatures 
             token={token}
             setSelectedFeatures={setSelectedFeatures} />
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-6 w-full md:w-1/5 mr-4 font-bold bg-white text-black px-2 py-2 rounded"
            >
              Summarize
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
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
            {url instanceof File ? (
              <input
                type="file"
                id="url"
                onChange={(e) => setUrl(e.target.files?.[0] || null)}
                className="w-full md:w-1/2 bg-transparent text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
              />
            ) : (
              <input
                placeholder="looking for a link..."
                type="text"
                id="url"
                value={url ? url : ""}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full md:w-1/2 mt-16 bg-transparent placeholder:text-white text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
              />
            )}
            <Error message={errorMessage} />
            <SelectFeatures 
             token={token}
             setSelectedFeatures={setSelectedFeatures} />
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
              style={{ transform: 'scale(115%)' }}
              fill
              src={imageUrl}
              alt="Background"
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </>
      )}
      {<Summary
        pdfTheme={pdfTheme}
        setCachedPdfs={setCachedPdfs}
        setPreviewPdfUrl={setPreviewPdfUrl}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        summary={response}
        imageBuffer={imageBuffer}
        questions={questions}
        pdfUrl={previewPdfUrl}
        handleThemeChange={handleThemeChange}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        generatePdf={generatePdf}
      />}
    </div>
  );
}
