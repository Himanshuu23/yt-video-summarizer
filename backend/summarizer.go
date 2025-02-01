package main

import (
    "log"
    "net"

    "google.golang.org/grpc"
    "context"

    "github.com/Himanshuu23/yt-video-summarizer/backend/summarizer"
)

type mySummarizerServer struct {
    summarizer.UnimplementedSummarizerServer
}

func (s *mySummarizerServer) Summarize(ctx context.Context, req *summarizer.SummarizeRequest) (*summarizer.SummarizeResponse, error) {
    return &summarizer.SummarizeResponse{Summary: "this is the summary"}, nil
}

func main() {
    lis, err := net.Listen("tcp", ":8090")
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
