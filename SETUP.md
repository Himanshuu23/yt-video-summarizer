# Setup Guide

## Quick Start

1. **Set up environment variables** - Create a `.env` file in the root directory:
```env
BART_API_KEY=your_key
BART_API_URL=https://api-inference.huggingface.co/models/facebook/bart-large-cnn
BART_API_URL_TWO=https://api-inference.huggingface.co/models/your-model
IMAGE_PIG_API_KEY=your_key
DATABASE_URL=your_database_url
```

2. **Start all services with Docker Compose:**
```bash
docker-compose up --build
```

## Architecture Changes

### What Changed

1. **Processing Logic Moved to Go Microservice**
   - All YouTube transcript fetching
   - Text summarization (BART API)
   - Question generation
   - Image generation
   - Text cleaning

2. **Express Backend Now**
   - Thin REST API layer
   - Calls gRPC server for processing
   - Still handles: PDF generation, translation, user management

3. **Go Microservice Components**
   - **gRPC Server**: Processes requests synchronously
   - **REST Server**: Queues tasks for async processing (2 instances, load balanced)
   - **Workers**: Process queued tasks (2 instances)

4. **Infrastructure**
   - Redis for caching and queuing
   - Nginx load balancer for REST servers
   - Multiple instances for scalability

### Ports

- Frontend: `3000`
- Backend (Express): `8000`
- gRPC Server: `8000` (internal)
- REST API (load balanced): `90`
- Redis: `6379`

### Service Communication

```
Frontend → Express Backend → gRPC Server → Processing
```

OR (for async):

```
Frontend → Express Backend → REST API → Redis Queue → Worker → gRPC Server
```

## Development

### Running Individual Services

**Express Backend:**
```bash
cd backend
npm install
npm run devStart
```

**gRPC Server:**
```bash
cd microservice
go run cmd/grpc_server/server.go
```

**REST Server:**
```bash
cd microservice
REDIS_ADDR=localhost:6379 GRPC_SERVER_ADDR=localhost:8000 PORT=90 go run cmd/rest/main.go
```

**Worker:**
```bash
cd microservice
REDIS_ADDR=localhost:6379 GRPC_SERVER_ADDR=localhost:8000 go run worker/main.go
```

**Redis:**
```bash
docker run -p 6379:6379 redis:alpine
```

## Notes

- The proto file is available at `backend/proto/summarize/summarize.proto` for the gRPC client
- In Docker, the proto file is mounted as a volume
- All processing is now handled by Go for better concurrency and performance
- Express backend maintains compatibility with existing frontend
