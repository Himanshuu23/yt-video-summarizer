package main

import (
    "context"
    "log"
    "net"
    "os"

    "github.com/joho/godotenv"
    "github.com/Himanshuu23/yt-video-summarizer/backend/transcriber"
    "google.golang.org/grpc"
)

type myTranscriberServer struct {
    transcriber.UnimplementedTranscriberServer
}

func (s *myTranscriberServer) GetTranscript(ctx context.Context, req *transcriber.TranscriptRequest) (*transcriber.TranscriptResponse, error) {
    return &transcriber.TranscriptResponse{
        Transcript: "These are the transcribers for the required YouTube video",
    }, nil
}

func main() {
    err := godotenv.Load()
    if err != nil {
	log.Fatalf("Error loading .env file")
    }

    port := os.Getenv("SERVER_ONE_PORT")
    if port == "" {
	port = "8089"
    }

    lis, err := net.Listen("tcp", ":"+port)
    if err != nil {
        log.Fatalf("Cannot create listener: %v", err)
    }

    grpcServer := grpc.NewServer()
    service := &myTranscriberServer{}

    transcriber.RegisterTranscriberServer(grpcServer, service)

    log.Println("Transcriber server is running on port 8089...")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
