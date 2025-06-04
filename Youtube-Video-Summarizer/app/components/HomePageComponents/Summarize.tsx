import React, { forwardRef, useState } from "react";
import Layout from "../Layout";
import { getCookie, setCookie } from "@/app/libs/cookie";
import { calculateTokenCost, updateUserTokens } from "@/app/libs/handleToken";
import { ErrorType } from "@/app/types/error";

const Summarize = forwardRef<HTMLDivElement>(() => {
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("");
  const [imageBuffer, setImageBuffer] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
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

    if (url === "") {
      setError("Please Enter a URL first.");
      return;
    }

    setIsModalOpen(true);

    try {
      const response = await fetch("https://yt-video-summarizer-e4zp.onrender.com/api/summarize/url", {
        method: "POST",
        body: JSON.stringify({ videoUrl: JSON.stringify(url), features: selectedFeatures, role: user.role }),
        headers: { "Content-type": "application/json" },
      });

      if (!response.ok) throw new Error("Server is busy. Please try again in a while.");

      const data = await response.json();
      
      setResponse(data.summary);
      setQuestions(data.questions);
      setImageBuffer(data.buffer);

      const email = user.email;
      const totalCost: number = calculateTokenCost(selectedFeatures) || 0;
      const newResponse = await updateUserTokens(email, -1 * totalCost);
      const newResult = await newResponse.json();

      setCookie(
        "user",
        JSON.stringify({ name: newResult.name, email: newResult.email, token: newResult.token, role: newResult.role })
      );
    } catch (err) {
      const error = err as ErrorType;
      setError(error.message);
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
    />
  );
});

Summarize.displayName = "Summarize";
export default Summarize;
