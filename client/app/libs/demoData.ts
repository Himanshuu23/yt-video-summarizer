/** Demo presentation mode — any YouTube URL returns this content after fake loading. */

export const DEMO_LOADING_MS = 45_000;

export const DEMO_REFERENCE_VIDEO =
  "https://youtu.be/-mN3VyJuCjM?si=6qGlmrbGSf7GbkpE";

export const DEMO_LOADING_STEPS = [
  "Fetching video metadata…",
  "Downloading transcript…",
  "Analyzing REST API concepts…",
  "Building structured study notes…",
  "Generating quiz questions…",
  "Polishing your summary…",
];

/** Plain-text fallback for PDF / speech when demo mode is on */
export const DEMO_SUMMARY_TEXT = `REST APIs — Study Notes

REST (Representational State Transfer) is an architectural style for networked applications. A REST API exposes resources (users, books, orders) as URLs and uses standard HTTP methods so clients and servers stay decoupled.

Core ideas:
• Client–server: UI runs on the client; data and business rules live on the server.
• Stateless: each request carries everything the server needs; no server-side session memory between calls.
• Uniform interface: predictable URLs + HTTP verbs (GET, POST, PUT/PATCH, DELETE).
• Resources identified by URLs, e.g. GET /books returns a list; GET /books/3 returns one book.

HTTP methods (CRUD):
• GET — read data (safe, idempotent). Example: GET /books
• POST — create a resource. Example: POST /books with JSON body
• PUT/PATCH — update. Example: PATCH /books/3
• DELETE — remove. Example: DELETE /books/3

Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.

Design tips: use nouns in paths, version your API (/api/v1/...), validate input, return JSON, document with OpenAPI/Swagger.`;

export const DEMO_QUESTIONS_TEXT = `Quiz — REST APIs

1. What does REST stand for and what problem does it solve?
Answer: Representational State Transfer — a standard way for clients (web/mobile apps) to talk to servers over HTTP using resources and verbs instead of custom protocols.

2. What is the difference between GET and POST? Give the /books example.
Answer: GET reads data without changing server state (e.g. GET /books lists books). POST creates new data (e.g. POST /books with a JSON body adds a book).

3. Why should REST APIs be stateless?
Answer: Each request is independent; the server does not rely on stored session context from earlier requests. That improves scalability, caching, and reliability behind load balancers.

4. What does a 404 status code mean?
Answer: The requested resource was not found at that URL (e.g. GET /books/999 when book 999 does not exist).

5. Name two good practices when designing REST endpoints.
Answer: Use noun-based paths (/users not /getUsers), return appropriate HTTP status codes, version the API, and document endpoints (e.g. Swagger/OpenAPI).`;

export const DEMO_IMAGES = [
  {
    src: "/img-1.png",
    alt: "REST API client-server architecture diagram",
    caption:
      "Client–server architecture: the client (browser/app) sends HTTP requests; the server processes them and returns JSON responses.",
  },
  {
    src: "/img-2.png",
    alt: "HTTP methods GET POST PUT DELETE with examples",
    caption:
      "HTTP verbs mapped to actions — GET /books to read, POST /books to create, and similar patterns for update and delete.",
  },
] as const;
