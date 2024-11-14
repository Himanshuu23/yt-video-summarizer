require('dotenv').config();

const express = require('express')
const axios = require('axios')
const { YoutubeTranscript } = require('youtube-transcript')
const router = express.Router();

const API_KEY = process.env.BART_API_KEY;
// const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const API_URL = 'https://api-inference.huggingface.co/models/google/pegasus-large';
const MAX_INPUT_LENGTH = 800;
const MAX_SUMMARY_LENGTH = 150;
const MIN_SUMMARY_LENGTH = 50;

// Function to chunk text into smaller parts
const chunkText = (text, chunkSize = MAX_INPUT_LENGTH) => {
    const words = text.split(' ');
    let chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    return chunks;
};

// Function to fetch transcript from YouTube video
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

// Function to summarize text using Hugging Face BART model
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
            return response.data[0].summary_text
        } else {
            throw new Error('Unexpected response format from summarization API');
        }

    } catch (error) {
        // Handle "Model is currently loading" error with retries
        if (error.response && error.response.data.error === 'Model facebook/bart-large-cnn is currently loading' && retries > 0) {
            console.log('Model is loading, retrying...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return summarizeText(text, retries - 1);
        }

        console.error('Error while summarizing:', error.response?.data || error.message);
        throw new Error('Failed to summarize text');
    }
};

// Function to summarize long texts by breaking them into chunks
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
    
    const wordsToRemove = ["well", "um", "er", "uh", "hmm", "like", "actually", "basically", 
            "seriously", "literally", "totally", "clearly", "you see", 
            "you know", "i mean", "you know what i mean", "at the end of the day", 
            "believe me", "i guess", "i suppose", "or something", "okay", 
            "so", "right", "mhm", "uh huh"
        ,"welcome back to my channel", "don't forget to like and subscribe", 
        "hey guys", "what's up everyone", "in today's video", 
        "thanks for tuning in", "if you're new here", "welcome to my channel", 
        "let's get started", "make sure to subscribe", "thanks for watching", 
        "see you in the next video", "hope you enjoyed the video", 
        "that's all for today", "take care", "i'll see you next time", 
        "thanks for tuning in", "don't forget to like, comment, and subscribe", "amp", "#", "&amp;#39;s"
    ]

    const pattern = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi');
    return summary.replace(pattern, '').trim();
}

const cleanHTMLentities = (summary) => {
    // Replace specific HTML entities with their corresponding characters
    return summary
        .replace(/&amp;#39;/g, "'") // Replaces &amp;#39; with an apostrophe
        .replace(/&amp;/g, "&")     // Replaces &amp; with an ampersand
        .replace(/&#39;/g, "'")     // Replaces &#39; with an apostrophe
        .replace(/&quot;/g, '"')    // Replaces &quot; with a double quote
        .replace(/&lt;/g, "<")      // Replaces &lt; with a less-than symbol
        .replace(/&gt;/g, ">")      // Replaces &gt; with a greater-than symbol
        .trim();                    // Trims any leading or trailing spaces
};

// Route to summarize YouTube video transcript
router.post('/summarize', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'YouTube video URL is required.' });
    }

    // Extract video ID from URL
    let videoId;
    if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop().split('?')[0];
    } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0];
    } else {
        return res.status(400).json({ error: 'Invalid YouTube video URL.' });
    }

    try {
        // Fetch transcript
        const transcript = await fetchTranscript(videoId);
        
        // Summarize in chunks
        const summary = await summarizeTextInChunks(transcript);
        const betterSummary = cleanSummary(summary)
        const finalSummary = cleanHTMLentities(betterSummary)

        // Return summarized result
        res.json({ summary: finalSummary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router