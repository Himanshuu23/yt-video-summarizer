"use client";

import { SpeechProps } from "../types/props";

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function questionItems(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const numbered = trimmed.split(/\n\s*(?=\d+[\.\)]\s)/);
  if (numbered.length > 1) return numbered.map((item) => item.trim()).filter(Boolean);
  return paragraphs(trimmed);
}

export default function Text({ summary, questions, imageSrc }: SpeechProps) {
  const summaryBlocks = paragraphs(summary);
  const quizBlocks = questionItems(questions);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300/80 mb-3">
          Overview
        </h3>
        <div className="space-y-4 text-[15px] sm:text-base leading-7 text-gray-200">
          {summaryBlocks.length > 0 ? (
            summaryBlocks.map((block, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {block}
              </p>
            ))
          ) : (
            <p className="text-gray-400">No summary was returned for this source.</p>
          )}
        </div>
      </section>

      {imageSrc && (
        <figure className="rounded-xl border border-white/10 bg-white/5 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt="Generated diagram"
            className="w-full max-h-80 object-contain rounded-md"
          />
          <figcaption className="mt-3 text-xs text-gray-400">
            Generated diagram for this summary
          </figcaption>
        </figure>
      )}

      {quizBlocks.length > 0 && (
        <section className="pt-2 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Questions &amp; Answers</h3>
          <ol className="space-y-4">
            {quizBlocks.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-7 text-gray-200 whitespace-pre-wrap"
              >
                {item}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
