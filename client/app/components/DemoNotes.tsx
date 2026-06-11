"use client";

import { useEffect, useState } from "react";
import useTypingEffect from "../hooks/useTypingAnimation";
import { DEMO_IMAGES, DEMO_QUESTIONS_TEXT, DEMO_REFERENCE_VIDEO } from "../libs/demoData";

interface DemoNotesProps {
  videoUrl: string;
}

function DemoImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <figure className="my-6 rounded-lg border border-white/15 bg-white/5 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        className="w-full max-h-72 object-contain rounded-md"
        onError={() => {
          if (imgSrc.endsWith(".png")) setImgSrc(src.replace(".png", ".jpg"));
          else if (imgSrc.endsWith(".jpg")) setImgSrc(src.replace(".jpg", ".jpeg"));
        }}
      />
      <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

const SUMMARY_SECTIONS = [
  {
    title: "Overview",
    body: `This session explains REST APIs — how web and mobile clients talk to servers using HTTP, JSON, and clear resource URLs. REST is not a library; it is a set of constraints that make APIs predictable and easy to scale.`,
  },
  {
    title: "What is REST?",
    body: `REST (Representational State Transfer) treats everything as a resource (users, products, orders). Each resource has a URL. You manipulate resources with HTTP methods instead of inventing custom action names in the URL.`,
    showImageAfter: 0,
  },
  {
    title: "Client–server & stateless design",
    body: `The client handles presentation; the server handles data and rules. Every request must include what the server needs (auth token, IDs, body). The server does not remember previous requests — that statelessness lets you add more servers behind a load balancer without sticky sessions.`,
  },
  {
    title: "HTTP methods (CRUD)",
    body: `GET reads (safe — no side effects). POST creates. PUT replaces; PATCH partially updates. DELETE removes. Example from the video: GET /books returns all books; POST /books with a JSON body creates a new book; GET /books/3 fetches one book by ID.`,
    showImageAfter: 1,
  },
  {
    title: "Status codes & JSON responses",
    body: `Use meaningful codes: 200 OK, 201 Created, 400 validation error, 401 unauthorized, 404 not found, 500 server error. Bodies are usually JSON: { "id": 3, "title": "Clean Code" }. Clients parse JSON; servers validate input before writing to a database.`,
  },
  {
    title: "Notes to learn from this video",
    body: `• Design URLs with nouns: /books not /getBooks.\n• Keep verbs in the HTTP method, not the path.\n• Version APIs: /api/v1/books.\n• Document with OpenAPI/Swagger.\n• Test with Postman or curl before wiring a frontend.\n• Think in resources first, then pick the right HTTP method.`,
  },
];

function TypedBlock({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);
  useTypingEffect(text, setTyped, setCursor);

  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
      {typed}
      {cursor && (
        <span className="ml-1 inline-block h-2 w-2 rounded-full bg-white animate-blink" />
      )}
    </p>
  );
}

export default function DemoNotes({ videoUrl }: DemoNotesProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const displayUrl = videoUrl.trim() || DEMO_REFERENCE_VIDEO;

  useEffect(() => {
    const t = setTimeout(() => setShowQuiz(true), 18_000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-500/30 bg-violet-950/30 px-4 py-3">
        <p className="text-sm text-violet-200">
          Summary of{" "}
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline break-all"
          >
            {displayUrl}
          </a>
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          REST APIs — concepts, architecture &amp; HTTP methods
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Reference:{" "}
          <a
            href={DEMO_REFERENCE_VIDEO}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {DEMO_REFERENCE_VIDEO}
          </a>
        </p>
      </div>

      {SUMMARY_SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 className="text-base font-semibold text-white mb-2 border-b border-white/10 pb-1">
            {section.title}
          </h3>
          <TypedBlock text={section.body} />
          {section.showImageAfter !== undefined && (
            <DemoImage {...DEMO_IMAGES[section.showImageAfter]} />
          )}
        </section>
      ))}

      {showQuiz && (
        <section className="pt-4 border-t border-white/15">
          <h2 className="text-lg font-bold mb-3">Questions &amp; Answers</h2>
          <TypedBlock text={DEMO_QUESTIONS_TEXT} />
        </section>
      )}
    </div>
  );
}
