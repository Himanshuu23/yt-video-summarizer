const { fetchTranscript, toPlainText } = require("youtube-transcript-plus");

const TRANSCRIPT_SIZE_LIMIT = {
  FREE: 100000,
  PRO: 50000,
  PREMIUM: 10000,
};

function extractVideoId(videoUrl) {
  const input = String(videoUrl).trim();
  const match = input.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  );
  return match ? match[1] : input;
}

async function fetchTranscriptForVideo(videoUrl, role) {
  const videoId = extractVideoId(videoUrl);
  const langsToTry = ["en", "en-US", "hi", undefined];

  const configBase = {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    retries: 2,
    retryDelay: 1000,
  };

  let lastError = null;

  for (const lang of langsToTry) {
    try {
      const config = lang ? { ...configBase, lang } : { ...configBase };
      const segments = await fetchTranscript(videoId, config);
      const fullTranscript = toPlainText(segments, " ").replace(/\s+/g, " ").trim();

      if (!fullTranscript) continue;

      const limit = TRANSCRIPT_SIZE_LIMIT[role] || TRANSCRIPT_SIZE_LIMIT.FREE;
      if (fullTranscript.length > limit) {
        throw new Error("Transcript size exceeds limit for your role");
      }

      return fullTranscript;
    } catch (error) {
      lastError = error;
      console.error(
        `Transcript fetch failed (${lang || "default"}):`,
        error.message
      );
    }
  }

  throw new Error(
    lastError?.message || "Failed to fetch transcript for this video."
  );
}

module.exports = fetchTranscriptForVideo;
