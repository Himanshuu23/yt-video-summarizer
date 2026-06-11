"use client";

import { useEffect } from "react";

export default function useTypingEffect(
  text: string,
  setTypedText: React.Dispatch<React.SetStateAction<string>>,
  setCursor: (val: boolean) => void
) {
  useEffect(() => {
    if (!text || typeof text !== "string") {
      setTypedText("");
      setCursor(false);
      return;
    }

    let i = 0;
    setTypedText("");
    setCursor(true);

    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setCursor(false), 500);
        return;
      }
      setTypedText((prev) => prev + text.charAt(i));
      i++;
    }, 15);

    return () => clearInterval(interval);
  }, [text]);
}
