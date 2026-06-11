package transcript

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const (
	transcriptSizeLimitFREE     = 100000
	transcriptSizeLimitPRO      = 50000
	transcriptSizeLimitPREMIUM  = 10000
	transcriptSizeLimitDefault  = 100000
)

type TranscriptItem struct {
	Text string `xml:",chardata"`
}

type TranscriptXML struct {
	XMLName xml.Name         `xml:"transcript"`
	Texts   []TranscriptItem `xml:"text"`
}

func FetchTranscript(videoID string, role string) (string, error) {
	// Extract video ID from URL if needed
	if strings.Contains(videoID, "youtu.be") {
		parts := strings.Split(videoID, "/")
		if len(parts) > 0 {
			videoID = strings.Split(parts[len(parts)-1], "?")[0]
		}
	} else if strings.Contains(videoID, "v=") {
		parts := strings.Split(videoID, "v=")
		if len(parts) > 1 {
			videoID = strings.Split(parts[1], "&")[0]
		}
	}

	// Fetch transcript from YouTube
	url := fmt.Sprintf("https://www.youtube.com/api/timedtext?lang=en&v=%s", videoID)
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch transcript: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Try alternative method using youtube-transcript library approach
		return fetchTranscriptAlternative(videoID)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read transcript: %w", err)
	}

	// Parse XML transcript
	transcript := parseTranscriptXML(string(body))

	// Check size limit based on role
	limit := getTranscriptLimit(role)
	if len(transcript) > limit {
		return "", fmt.Errorf("transcript size exceeds limit for your role")
	}

	return transcript, nil
}

func fetchTranscriptAlternative(videoID string) (string, error) {
	// Alternative method: Use a public API or library
	// For now, we'll use a simple approach
	// In production, you might want to use youtube-transcript-go or similar
	//url := fmt.Sprintf("https://www.youtube.com/watch?v=%s", videoID)
	
	// This is a placeholder - you'll need to implement actual transcript fetching
	// You might want to use a Go library like github.com/kkdai/youtube or similar
	return "", fmt.Errorf("transcript fetching not fully implemented - need YouTube API integration")
}

func parseTranscriptXML(xmlStr string) string {
	var transcript TranscriptXML
	if err := xml.Unmarshal([]byte(xmlStr), &transcript); err != nil {
		// Fallback to simple parsing if XML structure is different
		return parseTranscriptXMLSimple(xmlStr)
	}

	var textParts []string
	for _, item := range transcript.Texts {
		if strings.TrimSpace(item.Text) != "" {
			textParts = append(textParts, strings.TrimSpace(item.Text))
		}
	}

	return strings.Join(textParts, " ")
}

func parseTranscriptXMLSimple(xmlStr string) string {
	// Fallback simple parsing
	var text strings.Builder
	inTag := false
	var currentText strings.Builder

	for i, char := range xmlStr {
		if char == '<' {
			if currentText.Len() > 0 {
				text.WriteString(strings.TrimSpace(currentText.String()))
				text.WriteString(" ")
				currentText.Reset()
			}
			inTag = true
		} else if char == '>' {
			inTag = false
		} else if !inTag && i > 0 && xmlStr[i-1] == '>' {
			currentText.WriteRune(char)
		}
	}

	if currentText.Len() > 0 {
		text.WriteString(strings.TrimSpace(currentText.String()))
	}

	return strings.TrimSpace(text.String())
}

func getTranscriptLimit(role string) int {
	switch role {
	case "FREE":
		return transcriptSizeLimitFREE
	case "PRO":
		return transcriptSizeLimitPRO
	case "PREMIUM":
		return transcriptSizeLimitPREMIUM
	default:
		return transcriptSizeLimitDefault
	}
}
