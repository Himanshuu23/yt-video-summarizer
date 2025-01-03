import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function UploadComponent() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState("");
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [pdfTheme, setPdfTheme] = useState("default");
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");
  const [cachedPdfs, setCachedPdfs] = useState({});

  const handleSubmit = async () => {
    setResponse("Summary for the video");
    setIsSummaryVisible(true);
  };

  async function generatePdf(response) {
    try {
      const res = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        body: JSON.stringify({
          summary: response,
          theme: pdfTheme,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setCachedPdfs((prev) => ({
        ...prev,
        [pdfTheme]: url,
      }));

      setPreviewPdfUrl(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }

  const handleThemeChange = (theme) => {
    setPdfTheme(theme);
    if (cachedPdfs[theme]) {
      setPreviewPdfUrl(cachedPdfs[theme]);
    } else if (response) {
      generatePdf(response);
    }
  };

  function handleDownload() {
    if (previewPdfUrl) {
      const a = document.createElement('a');
      a.href = previewPdfUrl;
      a.download = 'Summary.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  useEffect(() => {
    if (response && !cachedPdfs[pdfTheme]) {
      generatePdf(response);
    }
  }, [pdfTheme, response]);

  return (
    <div className="h-screen w-screen bg-black overflow-x-hidden flex my-16">
      <div className="flex flex-col justify-center p-8 w-1/2">
        <h1 className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}>
          YouTube Video Summaries
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
            in a Flash
          </span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
          Generating notes in multiple themes to download in PDF format, available in multiple languages, and generating related questions for a deeper understanding.
        </p>
        <input
          placeholder="looking for a link..."
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-1/2 mt-16 bg-transparent placeholder:text-white text-white text-lg border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-md"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-1/5 font-bold bg-white text-black px-4 py-2 rounded"
        >
          Summarize
        </button>
      </div>
      <div className="w-2/5 h-full flex items-center justify-center relative ml-14">
        {!isSummaryVisible ? (
          <Image
            fill
            src="/hero.jpg"
            alt="Background"
            className="object-contain max-h-full max-w-full"
          />
        ) : (
          <div className="summary-section px-4 py-6 bg-black text-white h-full w-full flex flex-col justify-center items-center">
            <div className="summary-content text-center">
              {response ||
                "The German Johannes Gutenberg introduced printing in Europe. His invention had a decisive contribution in spread of mass-learning and in building the basis of the modern society. Gutenberg's major invention was a practical system permitting the mass production of printed books."}
              {!previewPdfUrl && (
                <button
                  onClick={() => generatePdf(response)}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Generate Pdf
                </button>
              )}
            </div>
            <div className="theme-options mt-4">
              <button
                onClick={() => handleThemeChange("default")}
                className="mr-2 px-4 py-2 bg-gray-300 text-black rounded"
              >
                Light Theme
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                Dark Theme
              </button>
            </div>
            <div className="pdf-preview mt-6">
              {previewPdfUrl && (
                <>
                  <h3 className="mb-4">PDF Preview</h3>
                  <iframe
                    src={previewPdfUrl}
                    style={{ width: "100%", height: "500px", border: "none" }}
                    title="PDF Preview"
                  />
                  <button
                    onClick={handleDownload}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
