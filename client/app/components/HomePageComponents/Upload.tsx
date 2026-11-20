"use client";

import React, { useState } from "react";
import Layout from "../Layout";
import { ErrorType } from "@/app/types/error";
import { API_URL } from "@/app/libs/api";
import { authHeaders } from "@/app/libs/authHeaders";
import { useAuth } from "@/app/contexts/AuthContext";
import { consumeFeatureTokens } from "@/app/libs/handleToken";
import { readApiError } from "@/app/libs/apiError";

export default function UploadComponent() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("");
  const [imageBuffer, setImageBuffer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("Sign in to summarize.");
      return;
    }

    if (!file) {
      setError("Please upload a PDF.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    if (isSubmitting) return;

    setIsModalOpen(true);
    setResponse("");
    setQuestions("");
    setImageBuffer("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("features", JSON.stringify(selectedFeatures));

      const res = await fetch(`${API_URL}/api/summarize/file`, {
        method: "POST",
        headers: await authHeaders(),
        body: formData,
      });

      if (res.status === 429) {
        throw new Error(await readApiError(res, "You're summarizing too quickly. Please wait a moment and try again."));
      }

      if (!res.ok) {
        throw new Error(await readApiError(res, "Server is busy. Please try again later."));
      }

      const data = await res.json() as {
        error?: string;
        summary?: string;
        questions?: string;
        buffer?: string;
      };

      if (!data.summary?.trim()) {
        throw new Error(data.error || "No summary was returned from this document.");
      }

      setResponse(data.summary);
      setQuestions(data.questions || "");
      setImageBuffer(typeof data.buffer === "string" ? data.buffer : "");
      await consumeFeatureTokens(user, selectedFeatures, setUser);
    } catch (err) {
      const error = err as ErrorType;
      setError(error.message);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout
      title1="Making Long Notes Short"
      title2="Light Work"
      subtitle="Upload a PDF to get the key points, optional questions, and a downloadable set of notes."
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
      selectedFeatures={selectedFeatures}
      isSubmitting={isSubmitting}
    />
  );
}
