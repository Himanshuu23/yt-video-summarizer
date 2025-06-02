const pdfParse = require('pdf-parse');
const fetchTranscript = require('../lib/transcript');
const summarizeTextInChunks = require('../lib/summary');
const { cleanSummary, cleanHTMLentities } = require('../lib/cleaner');
const { generateQuestions } = require('../lib/questions');
const { generateImage } = require('../lib/image');

const extractTextFromDocument = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        pdfParse(fileBuffer)
            .then(data => resolve(data.text))
            .catch(err => reject(err));
    });
};

const summarizeVideo = async (req, res) => {
    const { videoUrl, features, role } = req.body;

    if (role && role.length < 3) {
        return res.error(401).json({ error: "Login In to summarize" })
    }

    if (!videoUrl) {
        return res.status(400).json({ error: 'YouTube video URL is required.' });
    }

    let videoId, questions, compressedBase64;

    if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop().split('?')[0];
    } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0];
    } else {
        return res.status(400).json({ error: 'Invalid YouTube video URL.' });
    }

    try {
        const transcript = await fetchTranscript(videoId, role);
        const summary = await summarizeTextInChunks(transcript);
        const betterSummary = cleanSummary(summary);
        const finalSummary = cleanHTMLentities(betterSummary);
        if (features.includes("Questions & Answers")) {
            questions = await generateQuestions(finalSummary);
        }
        if (features.includes("Flowchart & Diagrams")) {
            const base64Image = await generateImage(finalSummary);
            compressedBase64 = Buffer.from(base64Image, 'base64').toString('base64');
        }
        res.json({ summary: finalSummary, questions: questions, buffer: compressedBase64 ? Array.from(compressedBase64) : null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const summarizeText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (role && role.length < 3) {
        return res.error(401).json({ error: "Login In to summarize" })
    }

    try {
        const features = JSON.parse(req.body.features || "[]");
        const fileBuffer = req.file.buffer;
        const extractedText = await extractTextFromDocument(fileBuffer);
        const summary = await summarizeTextInChunks(extractedText);
        const cleanedSummary = cleanSummary(summary);
        const finalSummary = cleanHTMLentities(cleanedSummary);

        let questions = null;
        let buffer = null;

        if (features.includes("Questions & Answers")) {
            questions = await generateQuestions(finalSummary);
        }

        if (features.includes("Flowchart & Diagrams")) {
            const base64Image = await generateImage(finalSummary);
            buffer = Buffer.from(base64Image, 'base64').toString('base64');
        }

        res.json({
            summary: finalSummary,
            questions: questions,
            buffer: buffer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { summarizeVideo, summarizeText };