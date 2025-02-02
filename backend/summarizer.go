package main

import (
    "log"
    "net"
    "os"
    "bytes"
    "encoding/json"
    "net/http"

    "google.golang.org/grpc"
    "context"

    "github.com/Himanshuu23/yt-video-summarizer/backend/summarizer"
    "github.com/joho/godotenv"
)

type mySummarizerServer struct {
    summarizer.UnimplementedSummarizerServer
}

const API_URL = "https://api-inference.huggingface.co/models/google/pegasus-large"
const API_KEY = "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"

func summarizeText(text string) (string, error) {
    requestBody := map[string]interface{}{
        "inputs": text,
        "parameters": map[string]int{
            "max_length": 150,
            "min_length": 50,
        },
    }

    body, err := json.Marshal(requestBody)
    if err != nil {
        return "", err
    }

    req, err := http.NewRequest("POST", API_URL, bytes.NewBuffer(body))
    if err != nil {
        return "", err
    }
    req.Header.Set("Authorization", "Bearer "+API_KEY)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var response []interface{}
    if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
        return "", err
    }

    responseBody, err := json.Marshal(response)
    if err != nil {
        return "", err
    }

    return string(responseBody), nil
}

func (s *mySummarizerServer) Summarize(ctx context.Context, req *summarizer.SummarizeRequest) (*summarizer.SummarizeResponse, error) {
    res, err := summarizeText(string(req.Transcript))
    if err != nil {
        log.Fatalf("Error summarizing text: %v", err)
        return nil, err
    }
    return &summarizer.SummarizeResponse{Summary: res}, nil
}

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    port := os.Getenv("SERVER_TWO_PORT")
    if port == "" {
        port = "8090"
    }

    lis, err := net.Listen("tcp", ":"+port)
    if err != nil {
        log.Fatalf("cannot create listener: %s", err)
    }

    grpcServer := grpc.NewServer()
    service := &mySummarizerServer{}

    summarizer.RegisterSummarizerServer(grpcServer, service)

    log.Println("Summarizer server is running on port 8090...")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
