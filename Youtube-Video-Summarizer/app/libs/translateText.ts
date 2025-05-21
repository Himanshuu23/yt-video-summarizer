import { handleError } from "./handleError";

export async function translate(language: string, text: string) {
    try {
      const res = await fetch("http://localhost:8000/translate", {
        method: "POST",
        body: JSON.stringify({ text, lang: language }),
        headers: { "Content-type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Translation failed");
  
      const result = await res.json();
      return result.translatedText;
    } catch (err: any) {
      handleError(err.message);
      return text;
    }
  }