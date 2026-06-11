package grpc_client

import (
	"context"
	"fmt"
	"microservice/summarize"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func getGRPCServerAddr() string {
	addr := os.Getenv("GRPC_SERVER_ADDR")
	if addr == "" {
		return "localhost:8000"
	}
	return addr
}

func SummarizeUrl(videoUrl string, features []string, role string) (*summarize.SummarizeResponse, error) {
	conn, err := grpc.NewClient("dns:///"+getGRPCServerAddr(), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("grpc client failed: %w", err)
	}
	defer conn.Close()

	client := summarize.NewSummarizeClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Second) // Longer timeout for processing
	defer cancel()

	resp, err := client.SummarizeUrl(ctx, &summarize.SummarizeUrlRequest{
		VideoUrl: videoUrl,
		Features: features,
		Role:     role,
	})
	if err != nil {
		return nil, fmt.Errorf("rpc error: %w", err)
	}

	return resp, nil
}

func SummarizeText(text string, features []string, role string) (*summarize.SummarizeResponse, error) {
	conn, err := grpc.NewClient("dns:///"+getGRPCServerAddr(), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("grpc client failed: %w", err)
	}
	defer conn.Close()

	client := summarize.NewSummarizeClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Second) // Longer timeout for processing
	defer cancel()

	resp, err := client.SummarizeText(ctx, &summarize.SummarizeTextRequest{
		Text:     text,
		Features: features,
		Role:     role,
	})
	if err != nil {
		return nil, fmt.Errorf("rpc error: %w", err)
	}

	return resp, nil
}