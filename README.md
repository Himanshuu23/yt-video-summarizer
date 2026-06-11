# YouTube Video Summarizer - Microservices Architecture

This project has been migrated to a microservices architecture with Go handling all processing, Redis caching, queuing, and worker pools, while Express serves as a thin REST API layer.

## Architecture Overview

- **Frontend (Next.js)**: React-based UI
- **Backend (Express)**: Thin REST API that calls gRPC services
- **Go Microservice**: 
  - **gRPC Server**: Handles all processing (transcript fetching, summarization, questions, images)
  - **REST Server**: Load-balanced instances for queuing tasks
  - **Workers**: Process queued tasks with Redis
- **Redis**: Caching and task queue
- **Nginx**: Load balancer for REST servers

## Services

1. **grpc-server**: Single gRPC server instance (port 8000)
2. **rest1/rest2**: Two REST server instances (port 90) - load balanced by nginx
3. **worker1/worker2**: Two worker instances for processing tasks
4. **backend**: Express API (port 8000)
5. **frontend**: Next.js app (port 3000)
6. **redis**: Redis cache and queue (port 6379)
7. **nginx-rest**: Nginx load balancer (port 90)

## Setup

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Go 1.24+ (for local development)

### Environment Variables

Create a `.env` file in the root directory with:

```env
# BART API for summarization
BART_API_KEY=your_bart_api_key
BART_API_URL=https://api-inference.huggingface.co/models/facebook/bart-large-cnn
BART_API_URL_TWO=https://api-inference.huggingface.co/models/your-model

# Image generation
IMAGE_PIG_API_KEY=your_image_pig_api_key

# Database
DATABASE_URL=your_database_url

# gRPC Server Address (for backend)
GRPC_SERVER_ADDR=grpc-server:8000
```

### Running with Docker Compose

```bash
docker-compose up --build
```

This will start all services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- REST API (load balanced): http://localhost:90
- gRPC Server: localhost:8000 (internal)

### Local Development

#### Backend (Express)
```bash
cd backend
npm install
npm run devStart
```

#### Go Microservice

**gRPC Server:**
```bash
cd microservice
go run cmd/grpc_server/server.go
```

**REST Server:**
```bash
cd microservice
go run cmd/rest/main.go
```

**Worker:**
```bash
cd microservice
go run worker/main.go
```

#### Frontend
```bash
cd Youtube-Video-Summarizer
npm install
npm run dev
```

## API Endpoints

### Express Backend (Port 8000)

- `POST /api/summarize/url` - Summarize YouTube video
- `POST /api/summarize/file` - Summarize PDF file
- `POST /api/pdf` - Generate PDF
- `POST /api/translate` - Translate text
- `GET /api/user/*` - User management endpoints

### Go REST API (Port 90, load balanced)

- `POST /summarize/url` - Queue URL summarization task
- `POST /summarize/text` - Queue text summarization task

## Architecture Flow

1. **Frontend** → Makes request to **Express Backend**
2. **Express Backend** → Calls **gRPC Server** for processing
3. **gRPC Server** → Processes request (transcript, summary, questions, images)
4. **Express Backend** → Returns response to **Frontend**

Alternatively (for async processing):
1. **Frontend** → Makes request to **Express Backend**
2. **Express Backend** → Calls **Go REST API** (load balanced)
3. **Go REST API** → Queues task in Redis
4. **Worker** → Picks up task, calls **gRPC Server**, caches result
5. **Go REST API** → Returns cached result

## Load Balancing

Nginx load balances requests between `rest1` and `rest2` instances. Configuration is in `microservice/nginx.conf`.

## Notes

- The Express backend now only handles:
  - PDF generation
  - Translation
  - User management
  - Calling gRPC for summarization
  
- All processing logic (transcript fetching, summarization, questions, images, cleaning) is handled by the Go microservice.

- Redis is used for both caching results and queuing tasks for async processing.

- Multiple worker instances can process tasks concurrently.
