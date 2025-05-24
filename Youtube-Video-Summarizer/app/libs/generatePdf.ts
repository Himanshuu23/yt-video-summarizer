import { getCookie, setCookie } from "./cookie";
import { handleError } from "./handleError";

export async function generatePdf(response: string, questions: string, buffer: string, pdfTheme: string, setCachedPdfs: any, setPreviewPdfUrl: any) {
  try {
    const user = JSON.parse(await getCookie("user") || "");
    const email = user.email;
    const role = user.role;

    const bufferSizeLimit: Record<string, number> = {
      FREE: 10 * 1024 * 1024,
      PRO: 5 * 1024 * 1024,
      PREMIUM: 1 * 1024 * 1024
    };

    if (buffer.length > (bufferSizeLimit[role] || bufferSizeLimit["user"])) {
      throw new Error("File size exceeds limit for your role");
    }

    const res = await fetch("http://localhost:8000/pdf", {
      method: "POST",
      body: JSON.stringify({ summary: response, theme: pdfTheme, questions, buffer }),
      headers: { "Content-type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to generate PDF");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const totalCost: number = calculateTokenCost(["Generate Pdf"]) || 35;
    const newResponse = await updateUserTokens(email, (-1 * totalCost));
    const newResult = await newResponse.json();

    setCookie("user", JSON.stringify({ name: newResult.name, email: newResult.email, token: newResult.token, role: newResult.role }));
    setCachedPdfs((prev: any) => ({ ...prev, [pdfTheme]: url }));
    setPreviewPdfUrl(url);
    return url;
  } catch (err: any) {
    handleError(err.message);
  }
}