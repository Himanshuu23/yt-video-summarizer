"use client";

import React, { useState } from "react";
import Layout from "../Layout";
import { getCookie } from "@/app/libs/cookie";
import { ErrorType } from "@/app/types/error";

export default function UploadComponent() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("");
  const [imageBuffer, setImageBuffer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cookie = getCookie("user");
    const user = cookie ? JSON.parse(cookie) : null;

    if (!user) {
      setError("Please log in to summarize");
      return;
    }

    if (!file) {
      setError("Please Upload a File.");
      return;
    }

    setIsModalOpen(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("features", JSON.stringify(selectedFeatures));

      const res = await fetch("https://yt-video-summarizer-e4zp.onrender.com/api/summarize/file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server is busy. Please try again later.");

      const data = await res.json();
      setResponse(data.summary);
      setQuestions(data.questions);
      setImageBuffer(`data:image/png;base64,${data.buffer}`);
      setIsModalOpen(true);
    } catch (err) {
      const error = err as ErrorType;
      setError(error.message);
    }
  }

  return (
    <Layout
      title1="Making Long Notes Short"
      title2="Light Work"
      subtitle="Upload your document or book to receive summarized notes highlighting key points, available in multiple formats, and complemented with related questions to enhance understanding and retention."
      imageUrl="/hero-2.png"
      response={response}
      questions={questions}
      imageBuffer={imageBuffer}
      fileUrl={file}
      setQuestions={setQuestions}
      setResponse={setResponse}
      setFileUrl={setFile}
      handleSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      type={2}
      errorMessage={error}
      setSelectedFeatures={setSelectedFeatures}
    />
  );
}
