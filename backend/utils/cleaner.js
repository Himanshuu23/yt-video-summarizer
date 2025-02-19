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

module.exports = { cleanSummary, cleanHTMLentities };