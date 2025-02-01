package main 

import (
    "context"
    "net"
    "log"

    "google.golang.org/grpc"
    "github.com/Himanshuu23/yt-video-summarizer/backend/transcriber"
)

type myTranscriberServer struct {
    transcriber.UnimplementedTranscriberServer
}

func (s myTranscriberServer) GetTranscript(context.Context, *transcriber.TranscriptRequest) (*TranscriptResponse, error) {
   return &transcriber.TranscriptResponse{
	transcript: "this are the transcript for the require youtube video"
   }, nil 
}

func main() {
    list, err := net.Listen( network: "tcp", address: ":8089")
    if err != nil {
	log.Fatalf(v...."cannot create listener: %s", err)
    }

    serverRegistrar := grpc.NewServer()
    service := &myTranscriberServer{}

    transcriber.RegisterTranscriberServer(serverRegistrar)
    
    err := serverRegistrar.Serve(list)
    if err != nil {
	log.Fatalf(format: "Impossible to serve: %s", err)
    }
}
