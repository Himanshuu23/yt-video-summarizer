import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function UploadComponent() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  return (
    <div className={`h-full w-full bg-black overflow-hidden flex mb-24`}>
      <div className="w-2/5 mt-8 ml-8 mr-24 flex items-center justify-center relative">
        {!isSummaryVisible ? (
          <Image
            fill
            src="/hero.jpg"
            alt="Background"
            className="object-contain max-h-full max-w-full"
          />
        ) : (
          <div className={`summary-section px-4 py-6 bg-black text-white flex flex-col justify-center items-center h-full w-full`}>
            <div className="summary-content text-center">
              The German Johannes Gutenberg introduced printing in Europe. His invention had a decisive contribution in spread of mass-learning and in building the basis of the modern society. Gutenberg's major invention was a practical system permitting the mass production of printed books.
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                Generate Pdf
              </button>
            </div>
            <div className="theme-options mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 text-black rounded">
                Light Theme
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded">
                Dark Theme
              </button>
            </div>
            <div className="pdf-preview mt-6">
              <h3 className="mb-4">PDF Preview</h3>
              <iframe
                src="https://via.placeholder.com/sample.pdf"
                style={{ width: "100%", height: "500px", border: "none" }}
                title="PDF Preview"
              />
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Download
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center pl-8 py-8 w-1/2">
        <h1 className={`${poppins.className} mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl tracking-wide`}>
        Making Long Notes Short
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b0082] via-[#ff00ff] to-[#1e90ff] animate-gradient mt-2">
            Light Work
          </span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 tracking-wider">
        Upload your document or book to receive summarized notes highlighting key points, available in multiple formats, and complemented with related questions to enhance understanding and retention.
        </p>
        <div className="flex w-full mt-10 py-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-white font-bold text-black"
          >
            Upload File
          </button>
          <button
            type="button"
            className="ml-4 bg-red-700 font-bold text-white px-4 py-2 rounded"
            onClick={() => setIsSummaryVisible(true)}
          >
            Summarize
          </button>
        </div>
      </div>
    </div>
  );
}
