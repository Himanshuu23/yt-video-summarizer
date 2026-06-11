package cleaner

import (
	"regexp"
	"strings"
)

var wordsToRemove = []string{
	"well", "um", "er", "uh", "hmm", "like", "actually", "basically",
	"seriously", "literally", "totally", "clearly", "you see", "you know",
	"i mean", "you know what i mean", "at the end of the day", "believe me",
	"i guess", "i suppose", "or something", "okay", "so", "right", "mhm",
	"uh huh", "welcome back to my channel", "don't forget to like and subscribe",
	"hey guys", "what's up everyone", "in today's video", "thanks for tuning in",
	"if you're new here", "welcome to my channel", "let's get started",
	"make sure to subscribe", "thanks for watching", "see you in the next video",
	"hope you enjoyed the video", "that's all for today", "take care",
	"i'll see you next time", "thanks for tuning in",
	"don't forget to like, comment, and subscribe", "amp", "#", "&amp;#39;s",
}

func CleanSummary(summary string) string {
	pattern := strings.Join(wordsToRemove, "|")
	re := regexp.MustCompile(`(?i)\b(` + regexp.QuoteMeta(pattern) + `)\b`)
	cleaned := re.ReplaceAllString(summary, "")
	return strings.TrimSpace(cleaned)
}

func CleanHTMLentities(summary string) string {
	cleaned := summary
	cleaned = strings.ReplaceAll(cleaned, "&amp;#39;", "'")
	cleaned = strings.ReplaceAll(cleaned, "&amp;", "&")
	cleaned = strings.ReplaceAll(cleaned, "&#39;", "'")
	cleaned = strings.ReplaceAll(cleaned, "&quot;", "\"")
	cleaned = strings.ReplaceAll(cleaned, "&lt;", "<")
	cleaned = strings.ReplaceAll(cleaned, "&gt;", ">")
	return strings.TrimSpace(cleaned)
}
