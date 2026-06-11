package main

import (
	"context"
	"encoding/json"
	"microservice/internal/envload"
	"microservice/cache"
	"microservice/grpc_client"
	"microservice/worker/tasks"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
)

type SummarizeUrlRequest struct {
	VideoUrl string   `json:"videoUrl"`
	Features []string `json:"features"`
	Role     string   `json:"role"`
}

type SummarizeTextRequest struct {
	Text     string   `json:"text"`
	Features []string `json:"features"`
	Role     string   `json:"role"`
}

var asynqClient *asynq.Client

func main() {
	envload.Load()
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	cache.Init(redisAddr)
	asynqClient = asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})

	router := gin.Default()
	router.Use(cors.Default())

	router.POST("/summarize/url", summarizeUrl)
	router.POST("/summarize/text", summarizeText)

	port := os.Getenv("PORT")
	if port == "" {
		port = "90"
	}

	router.Run(":" + port)
}

func summarizeUrl(c *gin.Context) {
	var request SummarizeUrlRequest
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Check cache
	cacheKey := "url:" + request.VideoUrl
	if val, err := cache.Get(ctx, cacheKey); err == nil {
		var cachedResponse map[string]interface{}
		if json.Unmarshal([]byte(val), &cachedResponse) == nil {
			c.JSON(http.StatusOK, cachedResponse)
			return
		}
	}

	// Enqueue task
	task, err := tasks.NewSummarizeUrlTask(request.VideoUrl, request.Features, request.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = asynqClient.Enqueue(task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"status": "queued"})
}

func summarizeText(c *gin.Context) {
	var request SummarizeTextRequest
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Check cache
	cacheKey := "text:" + request.Text[:min(50, len(request.Text))]
	if val, err := cache.Get(ctx, cacheKey); err == nil {
		var cachedResponse map[string]interface{}
		if json.Unmarshal([]byte(val), &cachedResponse) == nil {
			c.JSON(http.StatusOK, cachedResponse)
			return
		}
	}

	// Enqueue task
	task, err := tasks.NewSummarizeTextTask(request.Text, request.Features, request.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = asynqClient.Enqueue(task)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"status": "queued"})
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}