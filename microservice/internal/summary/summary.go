package summary

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	MAX_INPUT_LENGTH   = 800
	MAX_SUMMARY_LENGTH = 150
	MIN_SUMMARY_LENGTH = 50
)

type SummaryResponse struct {
	SummaryText string `json:"summary_text"`
}

func SummarizeText(text string, retries int) (string, error) {
	apiKey := os.Getenv("BART_API_KEY")
	apiURL := os.Getenv("BART_API_URL")
	
	if apiKey == "" || apiURL == "" {
		return "", fmt.Errorf("BART_API_KEY or BART_API_URL not set")
	}

	// Truncate text if too long
	truncatedText := text
	if len(text) > MAX_INPUT_LENGTH {
		truncatedText = text[:MAX_INPUT_LENGTH]
	}

	payload := map[string]interface{}{
		"inputs": truncatedText,
		"parameters": map[string]int{
			"max_length": MAX_SUMMARY_LENGTH,
			"min_length": MIN_SUMMARY_LENGTH,
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Check if model is loading
	var errorResp map[string]interface{}
	if err := json.Unmarshal(body, &errorResp); err == nil {
		if errMsg, ok := errorResp["error"].(string); ok {
			if strings.Contains(errMsg, "currently loading") && retries > 0 {
				time.Sleep(5 * time.Second)
				return SummarizeText(text, retries-1)
			}
			return "", fmt.Errorf("API error: %s", errMsg)
		}
	}

	var results []SummaryResponse
	if err := json.Unmarshal(body, &results); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if len(results) == 0 || results[0].SummaryText == "" {
		return "", fmt.Errorf("unexpected response format from summarization API")
	}

	return results[0].SummaryText, nil
}

func SummarizeTextInChunks(text string) (string, error) {
	chunks := chunkText(text)
	var summaries []string

	for _, chunk := range chunks {
		summary, err := SummarizeText(chunk, 3)
		if err != nil {
			return "", err
		}
		summaries = append(summaries, summary)
	}

	return strings.Join(summaries, " "), nil
}

func chunkText(text string) []string {
	chunkSize := MAX_INPUT_LENGTH
	words := strings.Fields(text)
	var chunks []string

	for i := 0; i < len(words); i += chunkSize {
		end := i + chunkSize
		if end > len(words) {
			end = len(words)
		}
		chunks = append(chunks, strings.Join(words[i:end], " "))
	}

	return chunks
}
