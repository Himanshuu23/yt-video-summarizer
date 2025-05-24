"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Layout from "../Layout";
import { getCookie } from "@/app/libs/cookie";

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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setUrl(uploadedFile);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault()

    const cookie = await getCookie("user");
    const user = cookie ? JSON.parse(cookie) : null;
    
    if (!user) {
      setError("Please log in to summarize");
      return;
    }

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
          body: formData, // need to send the features: selectedFeatures to the backend too
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
    <Layout title1="Making Long Notes Short" title2="Light Work" subtitle="Upload your document or book to receive summarized notes highlighting key points, available in multiple formats, and complemented with related questions to enhance understanding and retention." imageUrl="/hero-2.png" response={response} questions={questions} imageBuffer={imageBuffer} url={url} setQuestions={setQuestions} setResponse={setResponse} setUrl={setUrl} handleSubmit={handleSubmit} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type={2} errorMessage={error} setSelectedFeatures={setSelectedFeatures} />
  );   
}