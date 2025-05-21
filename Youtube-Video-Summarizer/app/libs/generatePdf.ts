import { handleError } from "./handleError";

export async function generatePdf(response: string, questions: string, buffer: string, pdfTheme: string, setCachedPdfs: any, setPreviewPdfUrl: any) {
    try {
      const res = await fetch("http://localhost:8000/pdf", {
        method: "POST",
        body: JSON.stringify({ summary: response, theme: pdfTheme, questions, buffer }),
        headers: { "Content-type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to generate PDF");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setCachedPdfs((prev: any) => ({ ...prev, [pdfTheme]: url }));
      setPreviewPdfUrl(url);
      return url;
    } catch (err: any) {
      handleError(err.message);
    }
}