package transcriber

import (
    "context"
    "net"
    "log"

    "google.golang.org/grpc"
)

type myTranscriberServer struct {
    UnimplementedTranscriberServer
}

func (s myTranscriberServer) GetTranscript(ctx context.Context, req *TranscriptRequest) (*TranscriptResponse, error) {
    return &TranscriptResponse{
        Transcript: "These are the transcripts for the required YouTube video",
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":8089")
    if err != nil {
        log.Fatalf("Cannot create listener: %v", err)
    }

    server := grpc.NewServer()
    service := &myTranscriberServer{}

    RegisterTranscriberServer(server, service)

    if err := server.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
