# Backend Implementation - Upload Track Feature

**Date:** January 21, 2026  
**Status:** Completed  
**Requirement:** docs/reqs/backend/001_upload_track.md

## Overview

First implementation of the TrackShare backend with support for the "Upload track" requirement. The backend is implemented in Swift 6 using the Vapor web framework and provides a REST API for uploading GPS tracks.

## Implementation Details

### Technology Stack

- **Language:** Swift 6
- **Framework:** Vapor 4.99.0
- **Database:** PostgreSQL (via Fluent ORM)
- **Driver:** FluentPostgresDriver 2.0.0

### Project Structure

```
src/backend/
├── Package.swift                    # Swift Package Manager configuration
├── Dockerfile                       # Container image definition
├── docker-compose.yml               # Local development setup
├── .env.example                     # Environment variables template
├── README.md                        # Documentation
├── test_api.sh                      # API testing script
└── Sources/
    └── App/
        ├── entrypoint.swift         # Application entry point
        ├── configure.swift          # App configuration
        ├── routes.swift             # Route definitions
        ├── Models/
        │   └── Track.swift          # Track data model
        ├── Migrations/
        │   └── CreateTrack.swift    # Database migration
        └── Controllers/
            └── TrackController.swift # Track upload logic
```

### Database Schema

**Table: tracks**

| Column       | Type      | Constraints       | Description                      |
|-------------|-----------|-------------------|----------------------------------|
| id          | UUID      | PRIMARY KEY       | Auto-generated unique ID         |
| identifier  | VARCHAR   | UNIQUE, NOT NULL  | Track identifier (max 256 chars) |
| gpx_content | TEXT      | NOT NULL          | Raw GPX file content             |
| uploaded_at | TIMESTAMP | NOT NULL          | Creation timestamp               |
| updated_at  | TIMESTAMP | NOT NULL          | Last modification timestamp      |

### API Endpoint

**POST /api/tracks/upload**

Uploads a new track or updates an existing one based on the identifier.

**Request:**
```json
{
  "identifier": "unique-track-id",
  "gpxContent": "<gpx>...</gpx>"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Track uploaded successfully",
  "identifier": "unique-track-id"
}
```

**Response (Update - 200 OK):**
```json
{
  "success": true,
  "message": "Track updated successfully",
  "identifier": "unique-track-id"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Identifier must be between 1 and 256 characters",
  "identifier": null
}
```

### Validation

The implementation includes the following validation:
- Identifier must be between 1 and 256 characters
- GPX content cannot be empty
- Duplicate identifiers are handled by updating the existing track

### Features Implemented

✅ REST API endpoint for track upload  
✅ Unique identifier support (max 256 characters)  
✅ GPX content storage  
✅ Automatic timestamp tracking (uploaded_at, updated_at)  
✅ Update existing tracks with same identifier  
✅ PostgreSQL database integration  
✅ Containerized deployment with Docker  
✅ Health check endpoint  
✅ Input validation and error handling  

### Features Not Yet Implemented

These features from the constraints document will be implemented in future iterations:

❌ API authentication for myTracks apps  
❌ Automatic track expiration after 30 days  
❌ Delete track endpoint  
❌ Retrieve track endpoint for frontend  

## Building and Running

### Using Docker Compose (Recommended)

```bash
cd src/backend
cp .env.example .env
docker-compose up -d
```

The API will be available at `http://localhost:8080`

### Local Development

```bash
cd src/backend
swift run
```

## Testing

Run the test script to verify the API:

```bash
cd src/backend
./test_api.sh
```

This will test:
- Health check endpoint
- Track upload (create)
- Track update
- Validation for empty identifier
- Validation for empty GPX content

## Deployment Notes

- The backend runs on port 8080
- Designed to work behind a Traefik reverse proxy
- Requires PostgreSQL database connection
- Database migrations run automatically on startup
- Container uses non-root user for security

## Next Steps

1. Implement API authentication for myTracks apps
2. Add track retrieval endpoint for frontend
3. Implement automatic track expiration (30 days)
4. Add delete track endpoint
5. Add comprehensive unit and integration tests
