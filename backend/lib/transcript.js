const { YoutubeTranscript } = require('youtube-transcript');

const fetchTranscript = async (videoUrl, role) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const fullTranscript = transcript.map(item => item.text).join(' ');

    const transcriptSizeLimit = {
      FREE: 100000,
      PRO: 50000,
      PREMIUM: 10000
    };

    if (fullTranscript.length > (transcriptSizeLimit[role] || transcriptSizeLimit["user"])) {
      throw new Error("Transcript size exceeds limit for your role");
    }

    return fullTranscript;
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    throw new Error('Failed to fetch transcript');
  }
};

module.exports = fetchTranscript;
