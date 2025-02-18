package main

import (
    "context"
    "log"
    "net"
    "os"
    "regexp"

    "github.com/joho/godotenv"
    "github.com/chand1012/yt_transcript"
    "github.com/Himanshuu23/yt-video-summarizer/backend/transcriber"
    "google.golang.org/grpc"
)

type myTranscriberServer struct {
    transcriber.UnimplementedTranscriberServer
}

func extractVideoID(url string) string {
    re := regexp.MustCompile(`(?:v=|\/)([0-9A-Za-z_-]{11})`)
    match := re.FindStringSubmatch(url)
    if len(match) > 1 {
        return match[1]
    }
    return ""
}

func GetYoutubeTranscript(url string) (string, error) {
    videoId := extractVideoID(url)
    if videoId == "" {
        return "", errors.New("invalid YouTube video URL")
    }

    hasTranscript, err := yt_transcript.HasTranscript(videoId, "en", "US")
    if err != nil || !hasTranscript {
        return "", errors.New("no transcript available for this video")
    }

    transcripts, _, err := yt_transcript.FetchTranscript(videoId, "en", "US")
    if err != nil {
        return "", errors.New("failed to fetch transcript: " + err.Error())
    }

    return "", nil
}

func (s *myTranscriberServer) GetTranscript(ctx context.Context, req *transcriber.TranscriptRequest) (*transcriber.TranscriptResponse, error) {
    transcript, err := GetYoutubeTranscript(req.Url)
    log.Println(transcript)
    if err != nil {
        return nil, err
    }

    return &transcriber.TranscriptResponse{
        Transcript: transcript,
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