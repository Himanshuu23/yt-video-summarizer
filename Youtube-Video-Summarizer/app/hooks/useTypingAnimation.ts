"use client"

import { useEffect } from "react";

export default function useTypingEffect(
    text: string,
    setTypedText: React.Dispatch<React.SetStateAction<string>>,
    setCursor: (val: boolean) => void
  ) {
    useEffect(() => {
      if (!text || typeof text !== "string" || text.length === 0) {
        setTypedText("");
        setCursor(false);
        return;
      }

      let i = 0;
      setTypedText("");
      setCursor(true);

      const interval = setInterval(() => {
        setTypedText((prev: string) => {
          if (i < text.length) {
            const updated = prev + text[i];
            i++;
            return updated;
          } else {
            clearInterval(interval);
            setTimeout(() => setCursor(false), 500);
            return prev;
          }
        });
      }, 15);

      return () => clearInterval(interval);
    }, [text]);
};