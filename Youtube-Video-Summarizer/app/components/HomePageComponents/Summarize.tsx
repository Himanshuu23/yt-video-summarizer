import React, { forwardRef, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Layout from "../Layout";
import { getCookie, setCookie } from "@/app/libs/cookie";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Summarize = forwardRef<HTMLDivElement>((props, ref) => {
  const [response, setResponse] = useState<string>("");
  const [questions, setQuestions] = useState<string>("")
  const [imageBuffer, setImageBuffer] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (url === "" ) {
      setError("Please Enter a URL first.")
      return
    }

    const user = JSON.parse(await getCookie("user") || "")

    try {
      const response = await fetch("http://localhost:8000/summarize/url", {
        method: "POST",
        body: JSON.stringify({ videoUrl: JSON.stringify(url), features: selectedFeatures, role: user.role }),
        headers: { "Content-type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Server is busy. Please try again in a while.");
  
      const data = await response.json();

      const email = user.email

      const totalCost: number = calculateTokenCost(selectedFeatures) || 0
      const newResponse = await updateUserTokens(email, (-1* totalCost));
      const newResult = await newResponse.json()

      setCookie("user", JSON.stringify({ name: newResult.name, email: newResult.email, token: newResult.token, role: newResult.role }))

      setIsModalOpen(true);
      setResponse(data.summary);
      setQuestions(data.questions);
      setImageBuffer(data.buffer);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Layout title1="Youtube Video Summaries" title2="in a Flash" subtitle="Generating notes in multiple themes to download in PDF format, available in multiple languages, and generating related questions for a deeper understanding." imageUrl="/hero-1.png" response={response} questions={questions} imageBuffer={imageBuffer} url={url} setQuestions={setQuestions} setResponse={setResponse} setUrl={setUrl} handleSubmit={handleSubmit} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type={1} errorMessage={error} setSelectedFeatures={setSelectedFeatures} />
  );  
});

export default Summarize;