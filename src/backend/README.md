# TrackShare Backend

Backend service for TrackShare application, implemented in Swift 6 using the Vapor framework.

## Overview

This backend provides a REST API for uploading and managing GPS tracks in GPX format. It is designed to work with the myTracks apps ecosystem.

## Features

- Upload GPX tracks with unique identifiers
- Update existing tracks
- PostgreSQL database for persistent storage
- RESTful API design
- Containerized deployment

## Requirements

- Swift 6.0 or later
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 16 (included in docker-compose)

## API Endpoints

### Upload Track

**Endpoint:** `POST /api/tracks/upload`

**Request Body:**
```json
{
  "identifier": "unique-track-id",
  "gpxContent": "<gpx>...</gpx>"
}
```

**Response (Success - 201 Created or 200 OK):**
```json
{
  "success": true,
  "message": "Track uploaded successfully",
  "identifier": "unique-track-id"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Error description",
  "identifier": null
}
```

### Health Check

**Endpoint:** `GET /health`

Returns the health status of the service.

## Development

### Local Development with Swift

1. Install Swift 6.0 or later
2. Set up PostgreSQL database
3. Copy `.env.example` to `.env` and configure database settings
4. Run the application:

```bash
swift run
```

The server will start on `http://localhost:8080`

### Using Docker Compose

1. Copy `.env.example` to `.env` and adjust settings if needed
2. Build and run with Docker Compose:

```bash
docker-compose up -d
```

This will start both the backend service and PostgreSQL database.

## Database Schema

### Tracks Table

| Column       | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key                           |
| identifier  | String    | Unique track identifier (max 256 chars)|
| gpx_content | String    | Raw GPX file content                  |
| uploaded_at | DateTime  | Track creation timestamp              |
| updated_at  | DateTime  | Last update timestamp                 |

## Environment Variables

- `DATABASE_URL`: Full PostgreSQL connection URL
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USER`: Database user (default: trackshare)
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: trackshare)

## Deployment

The application is designed to run in a container behind a Traefik reverse proxy. Ensure the following:

1. Database connection is properly configured
2. Container exposes port 8080
3. Traefik is configured to route traffic to the backend service

## License

See LICENSE file in the root of the repository.
