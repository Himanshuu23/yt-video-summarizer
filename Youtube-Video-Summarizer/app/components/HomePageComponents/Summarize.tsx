import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Summary from "../Summary";
import { ThemeType } from "@/app/types/theme";
import { handleError } from "@/app/libs/handleError";
import { translate } from "@/app/libs/translateText";
import { generatePdf } from "@/app/libs/generatePdf";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Summarize = forwardRef<HTMLDivElement>((props, ref) => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState<string>("");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [pdfTheme, setPdfTheme] = useState("default");
  const [cachedPdfs, setCachedPdfs] = useState<ThemeType>({
    default: null,
    dark: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [questions, setQuestions] = useState<string>("")
  const [imageBuffer, setImageBuffer] = useState<string>("")

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (url === "" ) {
      handleError("Please Enter a URL first.")
      return
    }

    setIsModalOpen(true);
    try {
      const response = await fetch("http://localhost:8000/summarize/url", {
        method: "POST",
        body: JSON.stringify({ videoUrl: JSON.stringify(url) }),
        headers: { "Content-type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to fetch summary");
  
      const data = await response.json();
      setResponse(data.summary);
      setQuestions(data.questions);
      setImageBuffer(data.buffer);
    } catch (err: any) {
      handleError(err.message);
    }
  }

  useEffect(() => {
    if (response && !cachedPdfs[pdfTheme]) {
      generatePdf(response, questions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
    }
  }, [pdfTheme, response]);

  useEffect(() => {
    if (response) {
      (async () => {
        const translatedSummary = await translate(selectedLanguage, response);
        const translatedQuestions = await translate(selectedLanguage, questions);
        setResponse(translatedSummary);
        setQuestions(translatedQuestions);
        generatePdf(translatedSummary, translatedQuestions, imageBuffer, pdfTheme, setCachedPdfs, setPreviewPdfUrl);
      })();
    }
  }, [selectedLanguage, response]);  

  return (
    null
  );  
});

export default Summarize;