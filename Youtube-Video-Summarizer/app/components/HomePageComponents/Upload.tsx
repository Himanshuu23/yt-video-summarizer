import Image from "next/image";
import { useState } from "react";

export default function UploadComponent() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  return (
    <div className="h-screen w-screen bg-black overflow-x-hidden flex">
      {!isSummaryVisible ? (
        <div className="flex w-full h-full">
          <div className="flex w-1/2 justify-center items-center py-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-white text-black"
            >
              Upload File
            </button>
            <button
              type="button"
              className="ml-4 bg-red-700 text-white px-4 py-2 rounded"
              onClick={() => setIsSummaryVisible(false)}
            >
              Summarize
            </button>
          </div>
          <div className="flex-grow w-1/2 relative flex items-center justify-center m-8">
            <Image
              fill
              src="/hero.jpg"
              alt="Random"
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>
      ) : (
        <div className="summary-section px-4 py-6 bg-black text-white w-full h-full flex flex-col justify-center items-center">
          <div className="summary-content text-center">
            The German Johannes Gutenberg introduced printing in Europe. His
            invention had a decisive contribution in spread of mass-learning and
            in building the basis of the modern society. Gutenberg major
            invention was a practical system permitting the mass production of
            printed books.
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
  ); 
}
