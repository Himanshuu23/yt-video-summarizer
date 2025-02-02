package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "google.golang.org/grpc"
    "github.com/Himanshuu23/yt-video-summarizer/backend/transcriber"
    "github.com/Himanshuu23/yt-video-summarizer/backend/summarizer"
)

func main() {
    transcriberConn, err := grpc.Dial("localhost:8089", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Could not connect to transcriber server: %v", err)
    }
    defer transcriberConn.Close()

    transcriberClient := transcriber.NewTranscriberClient(transcriberConn)

    transcriberReq := &transcriber.TranscriptRequest{Url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    defer cancel()

    transcriberRes, err := transcriberClient.GetTranscript(ctx, transcriberReq)
    if err != nil {
        log.Fatalf("Error calling GetTranscript: %v", err)
    }

    fmt.Println("Received Transcript:", transcriberRes.Transcript)

    summarizerConn, err := grpc.Dial("localhost:8090", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Could not connect to summarizer server: %v", err)
    }
    defer summarizerConn.Close()

    summarizerClient := summarizer.NewSummarizerClient(summarizerConn)

    summarizerReq := &summarizer.SummarizeRequest{Transcript: []byte(transcriberRes.Transcript)}

    summarizerRes, err := summarizerClient.Summarize(ctx, summarizerReq)
    if err != nil {
        log.Fatalf("Error calling Summarize: %v", err)
    }

    fmt.Println("Received Summary:", summarizerRes.Summary)
}
