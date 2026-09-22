const pdfParse = require('pdf-parse');
const fetchTranscript = require('../lib/transcript');
const { summarizeText: summarizeTextGrpc } = require('../utils/grpcClient');

function getSafeError(error) {
    const message = String(error?.message || "").toLowerCase();
   
    if (error?.code === "TRANSCRIPT_TOO_LARGE") {
        return {
            status: 413,
            message: "This video is too long for your current plan.",
        };
    }

    if (error?.code === "TRANSCRIPT_UNAVAILABLE") {
        return {
            status: 422,
            message: "Unable to retrieve captions for this video. Please try another video.",
        };
    }

    if (
        message.includes("transcript") ||
        message.includes("caption") ||
        message.includes("subtitles")
    ) {
        return {
            status: 422,
            message: "Unable to retrieve captions for this video. Please try another video.",
        };
    }

    if (
        message.includes("huggingface") ||
        message.includes("hugging face") ||
        message.includes("fetch failed") ||
        message.includes("enotfound") ||
        message.includes("econnrefused") ||
        message.includes("timeout") ||
        message.includes("grpc")
    ) {
        return {
            status: 503,
            message: "Our AI service is temporarily unavailable. Please try again later.",
        };
    }

    if (
        message.includes("pdf") ||
        message.includes("invalid") ||
        message.includes("parse")
    ) {
        return {
            status: 400,
            message: "Unable to read this document. Please upload a valid PDF.",
        };
    }

    return {
        status: 500,
        message: "Something went wrong while generating your summary. Please try again.",
    };
}

const extractTextFromDocument = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        pdfParse(fileBuffer)
            .then(data => resolve(data.text))
            .catch(err => reject(err));
    });
};

function normalizeVideoUrl(videoUrl) {
    if (typeof videoUrl !== 'string') return videoUrl;
    let url = videoUrl.trim();
    if (url.startsWith('"') && url.endsWith('"')) {
        try {
            url = JSON.parse(url);
        } catch {
            url = url.replace(/^"+|"+$/g, '');
        }
    }
    return url;
}

const summarizeVideo = async (req, res) => {
    const videoUrl = normalizeVideoUrl(req.body.videoUrl);
    const { features, role } = req.body;

    if (!role || String(role).length < 3) {
        return res.status(401).json({ error: "Please sign in to summarize." });
    }

    if (!videoUrl) {
        return res.status(400).json({ error: 'YouTube video URL is required.' });
    }

    try {
        const transcript = await fetchTranscript(videoUrl, role || 'FREE');

        if (!transcript || !transcript.trim()) {
            return res.status(400).json({ error: 'No transcript found for this video.' });
        }

        const result = await summarizeTextGrpc(transcript, features || [], role || 'FREE');

        if (!result?.summary?.trim()) {
            console.error("[summarizeVideo] Empty summary returned by summarizer");

            return res.status(503).json({ error: "Our AI service is temporarily unavailable. Please try again later.", });
        }

        res.json({
            summary: result.summary,
            questions: result.questions,
            buffer: result.buffer,
        });
    } catch (error) {
        console.error("[summarizeVideo]", error);
        
        const safeError = getSafeError(error);

        return res.status(safeError.status).json({ error: safeError.message, });
    }
};

const summarizeText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { role } = req.body;

    if (!role || String(role).length < 3) {
        return res.status(401).json({ error: "Please sign in to summarize." });
    }

    try {
        const features = JSON.parse(req.body.features || "[]");
        const fileBuffer = req.file.buffer;
        const extractedText = await extractTextFromDocument(fileBuffer);

        const result = await summarizeTextGrpc(extractedText, features, role || 'FREE');

        if (!result?.summary?.trim()) {
            console.error("[summarizeText] Empty summary returned by summarizer");

            return res.status(503).json({
                error: "Our AI service is temporarily available. Please try again later.",
            });
        }

        res.json({
            summary: result.summary,
            questions: result.questions,
            buffer: result.buffer,
        });
    } catch (error) {
        console.error("[summarizeText]", error);

        const safeError = getSafeError(error);

        return res.status(safeError.status).json({ error: safeError.message, });
    }
};

module.exports = { summarizeVideo, summarizeText };
