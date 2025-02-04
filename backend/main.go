package main
// Received Summary: [{"summary_text":"These are the transcribers for the required YouTube video If you would like to subscribe to our channel, please go to http://www.youtube.com/user/abpnewstv Like us on Facebook: https://www.facebook.com/abpnewstv Follow us on Twitter: https://twitter.com/abpnewstv Check out our website: http://www.abplive.in \u0026 http://www.youtube.com/user/abpnews"}]
import (
    "context"
    "fmt"
    "log"
    "time"
    "os"

    "google.golang.org/grpc"
    "github.com/Himanshuu23/yt-video-summarizer/backend/transcriber"
    "github.com/Himanshuu23/yt-video-summarizer/backend/summarizer"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    port1 := os.Getenv("SERVER_ONE_PORT")
    if port1 == "" {
        port1 = "8089"
    }
    
    port2 := os.Getenv("SERVER_TWO_PORT")
    if port2 == "" {
        port2 = "8090"
    }

    transcriberConn, err := grpc.Dial("localhost:"+port1, grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Could not connect to transcriber server: %v", err)
    }
    defer transcriberConn.Close()

    transcriberClient := transcriber.NewTranscriberClient(transcriberConn)

    transcriberReq := &transcriber.TranscriptRequest{Url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} // get this ytUrl from the http server through which we would be talking to the frontend
    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    defer cancel()

    transcriberRes, err := transcriberClient.GetTranscript(ctx, transcriberReq)
    if err != nil {
        log.Fatalf("Error calling GetTranscript: %v", err)
    }

    fmt.Println("Received Transcript:", transcriberRes.Transcript)

    summarizerConn, err := grpc.Dial("localhost:"+port2, grpc.WithInsecure())
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
