"use client"

import Image from "next/image";
import Summary from "./Summary";
import { LayoutProps } from "../types/props";
import { Poppins } from "next/font/google";
import { useState } from "react";
import { ThemeType } from "../types/theme";
import { generatePdf } from "../libs/generatePdf";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Layout({ title1, title2, subtitle, imageUrl, type }: LayoutProps) {
    const [pdfTheme, setPdfTheme] = useState("default");
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
      const [cachedPdfs, setCachedPdfs] = useState<ThemeType>({
        default: null,
        dark: null,
      });

      const handleThemeChange = (theme: string) => {
          setPdfTheme(theme);
          if (cachedPdfs[theme]) {
            setPreviewPdfUrl(cachedPdfs[theme]);
          } else if (response) {
            generatePdf(response, questions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
          }
        };

    return (
        <div id="video" className="h-screen w-screen bg-black overflow-hidden flex my-16 flex-col md:flex-row">
              <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
                <h1
                  className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}
                >
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
                  src={imageUrl}
                  alt="Background"
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              {<Summary
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