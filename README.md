# YouTube Video Summarizer

A distributed AI-powered platform that transforms YouTube videos and PDF documents into concise summaries, multilingual translations, AI-generated questions, downloadable reports, and visual flowcharts and images along with TTS support.

```text
YouTube URL / PDF → Transcript Pipeline → AI Processing → API Layer → Interactive Web App
```

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                       │
│  Next.js 14 • React • NextAuth • TailwindCSS               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       API Gateway Layer                     │
│  Express.js                                                 │
│  ├─ Authentication                                          │
│  ├─ User Management                                         │
│  ├─ PDF Generation                                          │
│  ├─ Translation Services                                    │
│  └─ gRPC Client Gateway                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Processing Layer (Go)                   │
│  gRPC Processing Server                                     │
│  ├─ Transcript Extraction                                   │
│  ├─ PDF Text Extraction                                     │
│  ├─ AI Summarization                                        │
│  ├─ Question Generation                                     │
│  ├─ Image Generation                                        │
│  └─ Content Processing                                      │
│                                                             │
│  REST Services + Redis Queue + Worker Pool                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                     │
│  Redis → Cache + Task Queue                                 │
│  Nginx → Load Balancer                                      │
│  PostgreSQL → User Data                                     │
│  Docker Compose → Service Orchestration                     │
└─────────────────────────────────────────────────────────────┘
```

## Features

- YouTube Video Summarization
- PDF Summarization
- AI Question Generation
- Translation
- PDF Export
- AI Image Generation
- Authentication
- Distributed Processing

## Services

| Service | Purpose |
|----------|----------|
| grpc-server | Core processing engine |
| rest1/rest2 | Processing API nodes |
| worker1/worker2 | Background workers |
| backend | Express API gateway |
| frontend | Next.js application |
| redis | Cache and queue |
| nginx-rest | Load balancer |

## Processing Flow

### Direct Processing

```text
Frontend → Express API → gRPC Server → AI Processing → Response
```

### Queue-Based Processing

```text
Frontend
  ↓
Express API
  ↓
REST Processing API
  ↓
Redis Task Queue
  ↓
Worker Pool
  ↓
gRPC Processing Server
  ↓
Redis Cache
  ↓
Response
```

Workers consume jobs from Redis, process them through the gRPC server, and cache results for fast retrieval.

## Quick Start

```bash
docker compose up --build
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run devStart
```

### Go Microservices

```bash
cd microservice
go run cmd/grpc_server/server.go
```
