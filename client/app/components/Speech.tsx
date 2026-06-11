"use client"

import Image from "next/image";
import { useState } from "react";
import { SpeechProps } from "../types/props";

export default function Speech({ summary, questions, selectedLanguage }: SpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const speakText = (text: string) => {
        if (!text) return;
    
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice =
          voices.find((v) => v.lang.startsWith(selectedLanguage ?? "en")) || voices[0];
    
        return utterance;
      };

    const speak = () => {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
          return;
        }
    
        if (!summary && !questions) return;
    
        window.speechSynthesis.cancel();
        setIsPlaying(true);
    
        const speech1 = speakText(summary);
        const speech2 = speakText(`Questions and Answers! ${questions}`);
    
        if (speech1 && speech2) {
          speech1.onend = () => window.speechSynthesis.speak(speech2);
          speech2.onend = () => setIsPlaying(false);
    
          window.speechSynthesis.speak(speech1);
        } else {
          setIsPlaying(false);
        }
      };

    return (
        <button
            onClick={speak}
            className="px-4 py-2 focus:outline-none rounded text-sm flex items-center justify-center"
        >
            <Image
            src={isPlaying ? "/stop.png" : "/play.png"}
            alt={isPlaying ? "Pause" : "Start"}
            width={24}
            height={24}
            className="invert"
        />
        </button>
    )
}