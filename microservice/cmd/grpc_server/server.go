package main

import (
	"context"
	"log"
	"microservice/internal/envload"
	"microservice/internal/cleaner"
	"microservice/internal/image"
	"microservice/internal/questions"
	"microservice/internal/summary"
	"microservice/internal/transcript"
	"microservice/summarize"
	"net"
	"strings"

	"google.golang.org/grpc"
)

type server struct {
	summarize.UnimplementedSummarizeServer
}

func (s *server) SummarizeUrl(ctx context.Context, req *summarize.SummarizeUrlRequest) (*summarize.SummarizeResponse, error) {
	// Extract video ID from URL
	videoID := req.VideoUrl
	if strings.Contains(videoID, "youtu.be") {
		parts := strings.Split(videoID, "/")
		if len(parts) > 0 {
			videoID = strings.Split(parts[len(parts)-1], "?")[0]
		}
	} else if strings.Contains(videoID, "v=") {
		parts := strings.Split(videoID, "v=")
		if len(parts) > 1 {
			videoID = strings.Split(parts[1], "&")[0]
		}
	}

	// Fetch transcript
	transcriptText, err := transcript.FetchTranscript(videoID, req.Role)
	if err != nil {
		return &summarize.SummarizeResponse{
			Error: err.Error(),
		}, nil
	}
	if strings.TrimSpace(transcriptText) == "" {
		return &summarize.SummarizeResponse{
			Error: "no transcript found for this video",
		}, nil
	}

	// Summarize
	summarizedText, err := summary.SummarizeTextInChunks(transcriptText)
	if err != nil {
		return &summarize.SummarizeResponse{
			Error: err.Error(),
		}, nil
	}

	// Clean summary
	cleanedSummary := cleaner.CleanSummary(summarizedText)
	finalSummary := cleaner.CleanHTMLentities(cleanedSummary)
	if strings.TrimSpace(finalSummary) == "" {
		return &summarize.SummarizeResponse{
			Error: "summarization returned empty result",
		}, nil
	}

	// Generate questions if requested
	var questionsStr string
	if contains(req.Features, "Questions & Answers") {
		questions, err := questions.GenerateQuestions(finalSummary)
		if err != nil {
			log.Printf("Error generating questions: %v", err)
		} else {
			questionsStr = questions
		}
	}

	// Generate image if requested
	var imageBase64 string
	if contains(req.Features, "Flowchart & Diagrams") {
		imageData, err := image.GenerateImage(finalSummary)
		if err != nil {
			log.Printf("Error generating image: %v", err)
		} else {
			imageBase64 = imageData
		}
	}

	return &summarize.SummarizeResponse{
		Summary:    finalSummary,
		Questions:  questionsStr,
		ImageBase64: imageBase64,
	}, nil
}

func (s *server) SummarizeText(ctx context.Context, req *summarize.SummarizeTextRequest) (*summarize.SummarizeResponse, error) {
	// Summarize text
	summarizedText, err := summary.SummarizeTextInChunks(req.Text)
	if err != nil {
		return &summarize.SummarizeResponse{
			Error: err.Error(),
		}, nil
	}

	// Clean summary
	cleanedSummary := cleaner.CleanSummary(summarizedText)
	finalSummary := cleaner.CleanHTMLentities(cleanedSummary)
	if strings.TrimSpace(finalSummary) == "" {
		return &summarize.SummarizeResponse{
			Error: "summarization returned empty result",
		}, nil
	}

	// Generate questions if requested
	var questionsStr string
	if contains(req.Features, "Questions & Answers") {
		questions, err := questions.GenerateQuestions(finalSummary)
		if err != nil {
			log.Printf("Error generating questions: %v", err)
		} else {
			questionsStr = questions
		}
	}

	// Generate image if requested
	var imageBase64 string
	if contains(req.Features, "Flowchart & Diagrams") {
		imageData, err := image.GenerateImage(finalSummary)
		if err != nil {
			log.Printf("Error generating image: %v", err)
		} else {
			imageBase64 = imageData
		}
	}

	return &summarize.SummarizeResponse{
		Summary:    finalSummary,
		Questions:  questionsStr,
		ImageBase64: imageBase64,
	}, nil
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func main() {
	envload.Load()
	lis, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	summarize.RegisterSummarizeServer(grpcServer, &server{})

	log.Println("gRPC server listening on :8000")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Serve failed: %v", err.Error())
	}
}