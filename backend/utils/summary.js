require('dotenv').config();

const axios = require('axios');

const API_KEY = process.env.BART_API_KEY;
const API_URL = process.env.BART_API_URL;
const MAX_INPUT_LENGTH = 800;
const MAX_SUMMARY_LENGTH = 150;
const MIN_SUMMARY_LENGTH = 50;

const chunkText = (text, chunkSize = MAX_INPUT_LENGTH) => {
    const words = text.split(' ');
    let chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
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

module.exports = summarizeTextInChunks;