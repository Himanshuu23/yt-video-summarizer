import { ThemeType } from "../types/theme";
import { getCookie } from "./cookie";
import { handleError } from "./handleError";
import { calculateTokenCost, persistUser, toPublicUser, updateUserTokens } from "./handleToken";
import { API_URL } from "./api";
import { readApiError } from "./apiError";

export async function generatePdf(response: string, questions: string, buffer: string, pdfTheme: string, setCachedPdfs: (pdf: (prev: ThemeType) => ThemeType) => void
, setPreviewPdfUrl: (url: string) => void) {
  try {
    const cookie = getCookie("user");
    if (!cookie) {
      throw new Error("Please sign in to generate a PDF.");
    }

    const user = JSON.parse(cookie);
    const email = user.email;
    const role = user.role;

    const bufferSizeLimit: Record<string, number> = {
      FREE: 10 * 1024 * 1024,
      PRO: 5 * 1024 * 1024,
      PREMIUM: 1 * 1024 * 1024
    };

    if (buffer && buffer.length > (bufferSizeLimit[role] || bufferSizeLimit.FREE)) {
      throw new Error("File size exceeds limit for your plan.");
    }

    const res = await fetch(`${API_URL}/api/pdf`, {
      method: "POST",
      body: JSON.stringify({ summary: response, theme: pdfTheme, questions, buffer }),
      headers: { "Content-type": "application/json" }
    });

    if (!res.ok) {
      throw new Error(await readApiError(res, "Failed to generate PDF"));
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const totalCost: number = calculateTokenCost(["Generate Pdf"]) || 35;
    const newResponse = await updateUserTokens(email, (-1 * totalCost));
    if (newResponse.ok) {
      const newResult = await newResponse.json();
      persistUser(toPublicUser(newResult));
    }

    setCachedPdfs((prev) => ({ ...prev, [pdfTheme]: url }));
    setPreviewPdfUrl(url);
    return url;
  } catch (error) {
    const message = error instanceof Error ? error.message : "There was an error while generating the PDF.";
    handleError(message);
  }
}
