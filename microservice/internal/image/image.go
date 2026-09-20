package image

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func GenerateImage(prompt string) (string, error) {
	apiKey := os.Getenv("IMAGE_PIG_API_KEY")
	apiURL := "https://api.imagepig.com"

	if apiKey == "" {
		return "", fmt.Errorf("IMAGE_PIG_API_KEY not set")
	}

	payload := map[string]string{
		"prompt": prompt,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Api-Key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to fetch image: status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if imageData, ok := result["image_data"].(string); ok {
		// ImagePig already returns base64; pass it through unchanged.
		return imageData, nil
	}

	return "", fmt.Errorf("unexpected response format from image API")
}
