"use client";

import React, { forwardRef, useState } from "react";
import Layout from "../Layout";
import { consumeFeatureTokens } from "@/app/libs/handleToken";
import { ErrorType } from "@/app/types/error";
import { API_URL } from "@/app/libs/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { isYouTubeUrl } from "@/app/libs/youtubeUrl";
import { readApiError } from "@/app/libs/apiError";

const Summarize = forwardRef<HTMLDivElement>(() => {
  const { user, setUser } = useAuth();
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("");
  const [imageBuffer, setImageBuffer] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("Please sign in to generate a summary.");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a YouTube URL first.");
      return;
    }

    if (!isYouTubeUrl(url)) {
      setError("Please paste a valid YouTube URL.");
      return;
    }

    if (isSubmitting) return;

    setIsModalOpen(true);
    setResponse("");
    setQuestions("");
    setImageBuffer("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/summarize/url`, {
        method: "POST",
        body: JSON.stringify({
          videoUrl: url.trim(),
          features: selectedFeatures,
          role: user.role || "FREE",
        }),
        headers: { "Content-type": "application/json" },
      });

      if (response.status === 429) {
        throw new Error(await readApiError(response, "You're summarizing too quickly. Please wait a moment and try again."));
      }

      if (!response.ok) {
        throw new Error(await readApiError(response, "Server is busy. Please try again in a while."));
      }

      const data = await response.json() as {
        error?: string;
        summary?: string;
        questions?: string;
        buffer?: string;
      };

      if (!data.summary?.trim()) {
        throw new Error(data.error || "No summary was returned. Try another video with captions enabled.");
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
      title1="Youtube Video Summaries"
      title2="in a Flash"
      subtitle="Generating notes in multiple themes to download in PDF format, available in multiple languages, and generating related questions for a deeper understanding."
      imageUrl="/hero-1.png"
      response={response}
      questions={questions}
      imageBuffer={imageBuffer}
      url={url}
      setQuestions={setQuestions}
      setResponse={setResponse}
      setUrl={setUrl}
      handleSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      type={1}
      errorMessage={error}
      setSelectedFeatures={setSelectedFeatures}
      selectedFeatures={selectedFeatures}
      isSubmitting={isSubmitting}
    />
  );
});

Summarize.displayName = "Summarize";
export default Summarize;
