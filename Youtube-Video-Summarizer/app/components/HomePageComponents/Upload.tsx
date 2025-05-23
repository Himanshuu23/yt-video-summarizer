"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Layout from "../Layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function UploadComponent() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("")
  const [imageBuffer, setImageBuffer] = useState<string>("")
  const [error, setError] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setUrl(uploadedFile);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (!url) {
      setError("Please Upload a File.")
      return
    }

    setIsModalOpen(true)

    if (url) {
      const formData = new FormData();
      formData.append("file", url);
      try {
        const res = await fetch("http://localhost:8000/summarize/file", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setResponse(data.summary);
        setQuestions(data.questions);
        setImageBuffer(`data:image/png;base64,${data.buffer}`)
        setIsModalOpen(true);
      } catch (error: any) {
        setError(error.message)
      }
    }
  }

  return (
    <Layout title1="Making Long Notes Short" title2="Light Work" subtitle="Upload your document or book to receive summarized notes highlighting key points, available in multiple formats, and complemented with related questions to enhance understanding and retention." imageUrl="/hero-2.png" response={response} questions={questions} imageBuffer={imageBuffer} url={url} setQuestions={setQuestions} setResponse={setResponse} setUrl={setUrl} handleSubmit={handleSubmit} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type={2} errorMessage={error} />
  );   
}

/*

<div id="notes" className={`h-full w-full bg-black overflow-hidden flex mb-24 flex-col md:flex-row`}>
      <div className="w-full md:w-2/5 mt-8 ml-8 mr-24 flex items-center justify-center relative">
        {!isSummaryVisible && (
          <Image
            style={{transform: 'scale(120%)'}}
            fill
            src="/hero-2.png"
            alt="Background"
            className="object-contain max-h-full max-w-full"
          />
        )}
      </div>
      <div className="flex flex-col justify-center pl-8 py-8 w-full md:w-1/2">
        <h1
          className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}
        >
          Making Long Notes Short
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
            Light Work
          </span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
          Upload your document or book to receive summarized notes highlighting
          key points, available in multiple formats, and complemented with
          related questions to enhance understanding and retention.
        </p>
        <div className="flex flex-col md:flex-row w-full mt-10 py-4 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleUpload}
            className="px-6 py-3 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-[calc(100%-120px)]"
          />
          <button
            type="button"
            className="mt-4 md:mt-0 w-full md:w-auto ml-0 md:ml-4 bg-red-700 font-bold text-white px-6 py-3 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleSummarize}
          >
            Summarize
          </button>
        </div>
      </div>
      {<Summary
        isOpen={isSummaryVisible}
        closeModal={() => setIsSummaryVisible(false)}
        summary={response}
        pdfUrl={previewPdfUrl}
        handleThemeChange={handleThemeChange}
        imageBuffer={imageBuffer}
        questions={questions}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        generatePdf={generatePdf}
        pdfTheme={pdfTheme}
        setCachedPdfs={setCachedPdfs}
        setPreviewPdfUrl={setPreviewPdfUrl}
      />}
    </div>


          */