package questions

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func GenerateQuestions(summary string) (string, error) {
	apiKey := os.Getenv("BART_API_KEY")
	apiURL := os.Getenv("BART_API_URL_TWO")

	if apiKey == "" || apiURL == "" {
		return "", fmt.Errorf("BART_API_KEY or BART_API_URL_TWO not set")
	}

	prompt := fmt.Sprintf("Generate 10 questions **with answers** from : %s", summary)

	req, err := http.NewRequest("POST", apiURL, bytes.NewBufferString(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Parse response - assuming it returns an array with generated_text
	var results []map[string]interface{}
	if err := json.Unmarshal(body, &results); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if len(results) == 0 {
		return "", fmt.Errorf("empty response from questions API")
	}

	if generatedText, ok := results[0]["generated_text"].(string); ok {
		return generatedText, nil
	}

	return "", fmt.Errorf("unexpected response format from questions API")
}
