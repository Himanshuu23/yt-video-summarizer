import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";

const Summarize = forwardRef<HTMLDivElement>((props, ref) => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState();
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [pdfTheme, setPdfTheme] = useState('default');
  const [cachedPdfs, setCachedPdfs] = useState({
    default: null,
    dark: null,
  });
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      body: JSON.stringify({
        videoUrl: JSON.stringify(url),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.summary);
        setIsSummaryVisible(true);
      })
      .catch((error) => console.log(error));
  }

  async function generatePdf(response: any) {
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
      const url: any = window.URL.createObjectURL(blob);

      setCachedPdfs((prev) => ({
        ...prev,
        [pdfTheme]: url,
      }));

      setPreviewPdfUrl(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }

  const handleThemeChange = (theme: string) => {
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
  }, [pdfTheme]);

  return (
    <div className="h-screen w-screen bg-black overflow-x-hidden flex">
      <div className="flex flex-col justify-center items-center p-8 w-1/2">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Better Data
          </span> 
          Scalable AI.
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
          Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
        </p>
        <input
          placeholder="Enter URL"
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 ml-16 rounded bg-white text-black w-1/2"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 bg-red-700 ml-16 text-white px-4 py-2 rounded"
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
                "The German Johannes Gutenberg introduced printing in Europe. His invention had a decisive contribution in spread of mass-learning and in building the basis of the modern society. Gutenberg major invention was a practical system permitting the mass production of printed books."}
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
})
export default Summarize;