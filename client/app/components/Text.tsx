"use client"

import { useState } from "react";
import useTypingEffect from "../hooks/useTypingAnimation";
import { SpeechProps } from "../types/props";

export default function Text({ summary, questions }: SpeechProps) {
    const [typedSummary, setTypedSummary] = useState("");
      const [typedQuestions, setTypedQuestions] = useState("");
      const [cursorVisible, setCursorVisible] = useState(true);
      const [cursorVisibleQ, setCursorVisibleQ] = useState(true);

      useTypingEffect(summary, setTypedSummary, setCursorVisible);
      useTypingEffect(questions, setTypedQuestions, setCursorVisibleQ);

    return (
        <>
              <p className="text-sm leading-relaxed">
                {typedSummary}
                {cursorVisible && summary && (
                  <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-blink"></span>
                )}
              </p>
              {questions && <h2>Questions & Answers</h2>}
              <p className="text-sm leading-relaxed">
                {typedQuestions}
                {cursorVisibleQ && questions && (
                  <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-blink"></span>
                )}
              </p>
        </>        
    )
}