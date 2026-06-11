const pdfParse = require('pdf-parse');
const fetchTranscript = require('../lib/transcript');
const { summarizeText: summarizeTextGrpc } = require('../utils/grpcClient');

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

    if (role && role.length < 3) {
        return res.status(401).json({ error: "Login In to summarize" });
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
            return res.status(500).json({ error: 'Summarization failed. Check Hugging Face API keys in backend/.env' });
        }

        res.json({
            summary: result.summary,
            questions: result.questions,
            buffer: result.buffer,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const summarizeText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { role } = req.body;

    if (role && role.length < 3) {
        return res.status(401).json({ error: "Login In to summarize" });
    }

    try {
        const features = JSON.parse(req.body.features || "[]");
        const fileBuffer = req.file.buffer;
        const extractedText = await extractTextFromDocument(fileBuffer);

        const result = await summarizeTextGrpc(extractedText, features, role || 'FREE');

        if (!result?.summary?.trim()) {
            return res.status(500).json({ error: 'Summarization failed.' });
        }

        res.json({
            summary: result.summary,
            questions: result.questions,
            buffer: result.buffer,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { summarizeVideo, summarizeText };
