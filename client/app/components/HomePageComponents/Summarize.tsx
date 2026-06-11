"use client";

import React, { forwardRef, useState } from "react";
import Layout from "../Layout";
// import { setCookie } from "@/app/libs/cookie";
// import { calculateTokenCost, updateUserTokens } from "@/app/libs/handleToken";
import { ErrorType } from "@/app/types/error";
// import { API_URL } from "@/app/libs/api";
// import { useAuth } from "@/app/contexts/AuthContext";
import {
  DEMO_LOADING_MS,
  DEMO_LOADING_STEPS,
  DEMO_QUESTIONS_TEXT,
  DEMO_SUMMARY_TEXT,
} from "@/app/libs/demoData";

/** Demo mode: skip backend; show hardcoded REST API summary after fake loading. */
const DEMO_MODE = true;

const Summarize = forwardRef<HTMLDivElement>(() => {
  // const { user } = useAuth();
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("");
  const [imageBuffer, setImageBuffer] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number | undefined>(
    undefined
  );
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  async function runDemoFlow() {
    setLoadingProgress(0);
    setLoadingMessage(DEMO_LOADING_STEPS[0]);

    const tickMs = 400;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += tickMs;
      const progress = Math.min(100, (elapsed / DEMO_LOADING_MS) * 100);
      setLoadingProgress(progress);
      const stepIndex = Math.min(
        DEMO_LOADING_STEPS.length - 1,
        Math.floor((elapsed / DEMO_LOADING_MS) * DEMO_LOADING_STEPS.length)
      );
      setLoadingMessage(DEMO_LOADING_STEPS[stepIndex]);
    }, tickMs);

    await new Promise((resolve) => setTimeout(resolve, DEMO_LOADING_MS));
    clearInterval(interval);

    setLoadingProgress(100);
    setLoadingMessage("Done!");
    setResponse(DEMO_SUMMARY_TEXT);
    setQuestions(DEMO_QUESTIONS_TEXT);
    setIsDemoMode(true);
    setLoadingProgress(undefined);
    setLoadingMessage(undefined);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (url === "") {
      setError("Please Enter a URL first.");
      return;
    }

    setIsModalOpen(true);
    setResponse("");
    setQuestions("");
    setIsDemoMode(false);
    setImageBuffer("");

    if (DEMO_MODE) {
      try {
        await runDemoFlow();
      } catch (err) {
        const error = err as ErrorType;
        setError(error.message || "Demo failed.");
        setIsModalOpen(false);
      }
      return;
    }

    /* Real backend — re-enable when not demoing
    const currentUser = user;
    try {
      const response = await fetch(`${API_URL}/api/summarize/url`, {
        method: "POST",
        body: JSON.stringify({ videoUrl: url, features: selectedFeatures, role: currentUser.role }),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Server is busy. Please try again in a while.");
      }
      if (!data.summary?.trim()) {
        throw new Error(data?.error || "No summary was returned. Try another video with captions enabled.");
      }
      setResponse(data.summary);
      setQuestions(data.questions || "");
      setImageBuffer(typeof data.buffer === "string" ? data.buffer : "");
      const totalCost: number = calculateTokenCost(selectedFeatures) || 0;
      if (totalCost > 0) {
        try {
          const newResponse = await updateUserTokens(currentUser.email, -1 * totalCost);
          if (newResponse.ok) {
            const newResult = await newResponse.json();
            setCookie("user", JSON.stringify({
              name: newResult.name,
              email: newResult.email,
              token: newResult.token,
              role: newResult.role,
            }));
          }
        } catch { }
      }
    } catch (err) {
      const error = err as ErrorType;
      setError(error.message);
      setIsModalOpen(false);
    }
    */
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
      isDemoMode={isDemoMode}
      demoVideoUrl={url}
      loadingProgress={loadingProgress}
      loadingMessage={loadingMessage}
    />
  );
});

Summarize.displayName = "Summarize";
export default Summarize;
