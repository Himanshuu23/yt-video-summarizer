const pdfParse = require('pdf-parse');
const fetchTranscript = require('../utils/transcript');
const summarizeTextInChunks = require('../utils/summary');
const { cleanSummary, cleanHTMLentities } = require('../utils/cleaner');
const { generateQuestions } = require('../utils/questions');
const { generateImage } = require('../utils/image');

const extractTextFromDocument = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        pdfParse(fileBuffer)
            .then(data => resolve(data.text))
            .catch(err => reject(err));
    });
};

const summarizeVideo = async (req, res) => {
    const { videoUrl } = req.body;
    
    if (!videoUrl) {
        return res.status(400).json({ error: 'YouTube video URL is required.' });
    }

    let videoId;

    if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop().split('?')[0];
    } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0];
    } else {
        return res.status(400).json({ error: 'Invalid YouTube video URL.' });
    }

    try {
        const transcript = await fetchTranscript(videoId);
        const summary = await summarizeTextInChunks(transcript);
        const betterSummary = cleanSummary(summary);
        const finalSummary = cleanHTMLentities(betterSummary);
        const questions = await generateQuestions(finalSummary);
        const buffer = await generateImage(finalSummary);
        res.json({ summary: finalSummary, questions: questions, buffer: buffer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const summarizeText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const fileBuffer = req.file.buffer;
        const extractedText = await extractTextFromDocument(fileBuffer);
        const summary = await summarizeTextInChunks(extractedText);
        const cleanedSummary = cleanSummary(summary);
        const finalSummary = cleanHTMLentities(cleanedSummary);
        const questions = await generateQuestions(finalSummary);
        const buffer = await generateImage(finalSummary);
        res.json({ summary: finalSummary, questions: questions, buffer: buffer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

module.exports = { summarizeVideo, summarizeText };