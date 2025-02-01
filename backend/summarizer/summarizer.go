package summarizer 

import (
    "context"
    "net"
    "log"

    "google.golang.org/grpc"
)

type mySummarizerServer struct {
    UnimplementedSummarizerServer
}

func (s mySummarizerServer) Summarize(ctx context.Context, req *SummarizeRequest) (*SummarizeResponse, error) {
   return &SummarizeResponse{
	Summary: "this is the summary"
   }, nil 
}

func main() {
    list, err := net.Listen( "tcp", ":8089")
    if err != nil {
	log.Fatalf("cannot create listener: %s", err)
    }

    serverRegistrar := grpc.NewServer()
    service := &mySummarizerServer{}

    RegisterSummarizerServer(serverRegistrar, service)

    if err := server.Serve(lis); err != nil {
	log.Fatalf("Failed to serve: %v", err)
    }
}
