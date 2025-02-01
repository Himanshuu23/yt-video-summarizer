package main

import (
    "context"
    "log"
    "net"

    "github.com/Himanshuu23/yt-video-summarizer/backend/transcript"
    "google.golang.org/grpc"
)

type myTranscriberServer struct {
    transcript.UnimplementedTranscriberServer
}

func (s *myTranscriberServer) GetTranscript(ctx context.Context, req *transcript.TranscriptRequest) (*transcript.TranscriptResponse, error) {
    return &transcript.TranscriptResponse{
        Transcript: "These are the transcripts for the required YouTube video",
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":8089")
    if err != nil {
        log.Fatalf("Cannot create listener: %v", err)
    }

    grpcServer := grpc.NewServer()
    service := &myTranscriberServer{}

    transcript.RegisterTranscriberServer(grpcServer, service)

    log.Println("Transcriber server is running on port 8089...")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
