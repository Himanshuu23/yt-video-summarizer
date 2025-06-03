import { ThemeType } from "../types/theme";
import { getCookie, setCookie } from "./cookie";
import { handleError } from "./handleError";
import { calculateTokenCost, updateUserTokens } from "./handleToken";

export async function generatePdf(response: string, questions: string, buffer: string, pdfTheme: string, setCachedPdfs: (pdf: (prev: ThemeType) => ThemeType) => void
, setPreviewPdfUrl: (url: string) => void) {
  try {
    const cookie = getCookie("user");
    const user = JSON.parse(cookie || "");
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

    const res = await fetch("https://yt-video-summarizer-tzf8.vercel.app/api/pdf", {
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
    setCachedPdfs((prev) => ({ ...prev, [pdfTheme]: url }));
    setPreviewPdfUrl(url);
    return url;
  } catch (error) {
    console.log(error)
    handleError("Their was an error while generating pdf. Please try again in a while.");
  }
}