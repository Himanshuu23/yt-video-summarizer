package worker

import (
	"context"
	"encoding/json"
	"microservice/cache"
	"microservice/grpc_client"
	"time"

	"github.com/hibiken/asynq"
)

const (
	TaskSummarizeUrl  = "url:summarize"
	TaskSummarizeText = "text:summarize"
)

type SummarizeUrlPayload struct {
	VideoUrl string   `json:"video_url"`
	Features []string `json:"features"`
	Role     string   `json:"role"`
}

type SummarizeTextPayload struct {
	Text     string   `json:"text"`
	Features []string `json:"features"`
	Role     string   `json:"role"`
}

func NewSummarizeUrlTask(videoUrl string, features []string, role string) (*asynq.Task, error) {
	payload, err := json.Marshal(SummarizeUrlPayload{
		VideoUrl: videoUrl,
		Features: features,
		Role:     role,
	})
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TaskSummarizeUrl, payload), nil
}

func NewSummarizeTextTask(text string, features []string, role string) (*asynq.Task, error) {
	payload, err := json.Marshal(SummarizeTextPayload{
		Text:     text,
		Features: features,
		Role:     role,
	})
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TaskSummarizeText, payload), nil
}

func HandleSummarizeUrlTask(ctx context.Context, t *asynq.Task) error {
	var p SummarizeUrlPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return err
	}

	response, err := grpc_client.SummarizeUrl(p.VideoUrl, p.Features, p.Role)
	if err != nil {
		return err
	}

	// Cache the response
	cacheKey := "url:" + p.VideoUrl
	cacheData, _ := json.Marshal(response)
	cache.Set(ctx, cacheKey, string(cacheData), time.Hour)
	return nil
}

func HandleSummarizeTextTask(ctx context.Context, t *asynq.Task) error {
	var p SummarizeTextPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return err
	}

	response, err := grpc_client.SummarizeText(p.Text, p.Features, p.Role)
	if err != nil {
		return err
	}

	// Cache the response
	cacheKey := "text:" + p.Text[:min(50, len(p.Text))]
	cacheData, _ := json.Marshal(response)
	cache.Set(ctx, cacheKey, string(cacheData), time.Hour)
	return nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}