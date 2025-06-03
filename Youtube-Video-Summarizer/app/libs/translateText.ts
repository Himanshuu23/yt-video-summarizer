import { handleError } from "./handleError";

export async function translate(language: string, text: string) {
    try {
      const res = await fetch("https://yt-video-summarizer-tzf8.vercel.app/api/translate", {
        method: "POST",
        body: JSON.stringify({ text, lang: language }),
        headers: { "Content-type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Translation failed");
  
      const result = await res.json();
      return result.translatedText;
    } catch (err) {
      console.log(err)
      handleError("Their was a problem translating text. Please try again in a while.");
      return text;
    }
  }