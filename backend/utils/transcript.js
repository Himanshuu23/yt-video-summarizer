const { YoutubeTranscript } = require('youtube-transcript');

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

module.exports = fetchTranscript;