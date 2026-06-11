package main

import (
	"log"
	"microservice/internal/envload"
	"microservice/worker/tasks"
	"os"

	"github.com/hibiken/asynq"
)

func main() {
	envload.Load()
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: redisAddr},
		asynq.Config{Concurrency: 10},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(tasks.TaskSummarizeUrl, tasks.HandleSummarizeUrlTask)
	mux.HandleFunc(tasks.TaskSummarizeText, tasks.HandleSummarizeTextTask)

	log.Println("Worker server started")
	if err := srv.Run(mux); err != nil {
		log.Fatalf("worker run failed: %v", err)
	}
}