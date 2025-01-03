require('dotenv').config();

const express = require('express');
const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();

const API_KEY = process.env.BART_API_KEY;
const API_URL = process.env.BART_API_URL;
const MAX_INPUT_LENGTH = 800;
const MAX_SUMMARY_LENGTH = 150;
const MIN_SUMMARY_LENGTH = 50;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const chunkText = (text, chunkSize = MAX_INPUT_LENGTH) => {
    const words = text.split(' ');
    let chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
};

const fetchTranscript = async (videoUrl) => {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
        const fullTranscript = transcript.map(item => item.text).join(' ');
        return fullTranscript;
    } catch (error) {
        console.error('Error fetching transcript:', error.message);
        throw new Error('Failed to fetch transcript');
    }
};

const summarizeText = async (text, retries = 3) => {
    try {
        const truncatedText = text.length > MAX_INPUT_LENGTH ? text.slice(0, MAX_INPUT_LENGTH) : text;
        const response = await axios.post(
            API_URL,
            {
                inputs: truncatedText,
                parameters: {
                    max_length: MAX_SUMMARY_LENGTH,
                    min_length: MIN_SUMMARY_LENGTH,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );
        if (response.data && response.data[0] && response.data[0].summary_text) {
            return response.data[0].summary_text;
        } else {
            throw new Error('Unexpected response format from summarization API');
        }
    } catch (error) {
        if (error.response && error.response.data.error === 'Model facebook/bart-large-cnn is currently loading' && retries > 0) {
            console.log('Model is loading, retrying...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return summarizeText(text, retries - 1);
        }
        console.error('Error while summarizing:', error.response?.data || error.message);
        throw new Error('Failed to summarize text');
    }
};

const summarizeTextInChunks = async (text) => {
    const chunks = chunkText(text);
    let summaries = [];
    for (const chunk of chunks) {
        const summary = await summarizeText(chunk);
        summaries.push(summary);
    }
    return summaries.join(' ');
};

const cleanSummary = (summary) => {
    const wordsToRemove = ["well", "um", "er", "uh", "hmm", "like", "actually", "basically", "seriously", "literally", "totally", "clearly", "you see", "you know", "i mean", "you know what i mean", "at the end of the day", "believe me", "i guess", "i suppose", "or something", "okay", "so", "right", "mhm", "uh huh", "welcome back to my channel", "don't forget to like and subscribe", "hey guys", "what's up everyone", "in today's video", "thanks for tuning in", "if you're new here", "welcome to my channel", "let's get started", "make sure to subscribe", "thanks for watching", "see you in the next video", "hope you enjoyed the video", "that's all for today", "take care", "i'll see you next time", "thanks for tuning in", "don't forget to like, comment, and subscribe", "amp", "#", "&amp;#39;s"];
    const pattern = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi');
    return summary.replace(pattern, '').trim();
};

const cleanHTMLentities = (summary) => {
    return summary
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
};

router.post('/summarize-url', async (req, res) => {
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
        res.json({ summary: finalSummary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/summarize-file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const fileBuffer = req.file.buffer;
        const extractedText = await extractTextFromDocument(fileBuffer);
        const summary = await summarizeTextInChunks(extractedText);
        const cleanedSummary = cleanSummary(summary);
        const finalSummary = cleanHTMLentities(cleanedSummary);
        res.json({ summary: finalSummary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const extractTextFromDocument = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        pdfParse(fileBuffer)
            .then(data => resolve(data.text))
            .catch(err => reject(err));
    });
};

module.exports = router;