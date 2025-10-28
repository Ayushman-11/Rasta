# Transit Backend

Go backend for onboard user tracking.

## Setup
1. Install Go: https://golang.org/dl/
2. Run `go mod tidy` to install dependencies.
3. Replace `your-mongodb-connection-string` in main.go with your Atlas string.
4. Run `go run main.go` to start server on :8080.

## Endpoints
- POST /share: Share bus journey (JSON body: Bus struct)
- GET /onboard: Get active onboard users
- WS /ws: WebSocket for real-time updates

## Deploy
Use Railway or Heroku for production.