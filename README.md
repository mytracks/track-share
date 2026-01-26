# TrackShare

Share GPS tracks from myTracks apps via web browser - no installation required for viewers.

## Overview

TrackShare enables users of the [myTracks](https://www.mytracks4mac.info) suite of apps to share GPS tracks with anyone via a simple URL. Recipients can view the track on an interactive map using just their web browser, without needing any special software installed.

## Features

### For Track Uploaders (myTracks Users)
- Upload GPX tracks via REST API
- Get shareable URL for each track
- Delete tracks when no longer needed
- Secure API key authentication

### For Track Viewers (Anyone)
- View tracks on interactive OpenStreetMap
- See track statistics (distance, duration, elevation)
- Pan and zoom the map
- Works on mobile and desktop
- No registration or installation required

## Quick Start

### Run with Docker Compose

```bash
cd src/backend
docker-compose up -d
```

Access the application:
- Frontend: http://localhost/
- Backend API: http://localhost:8080/api

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Architecture

The system consists of three main components:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  PostgreSQL │
│   (nginx)   │      │   (.NET 8)  │      │  Database   │
│   Port 80   │      │  Port 8080  │      │  Port 5432  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js for interactive maps
- nginx web server
- Docker container

**Backend:**
- .NET 8 / ASP.NET Core
- Entity Framework Core
- PostgreSQL database
- REST API
- Docker container

## Project Structure

```
trackshare/
├── docs/
│   ├── arc42/              # Architecture documentation
│   ├── ai/                 # AI agent guidelines
│   └── entities/           # Entity specifications
├── src/
│   ├── backend/
│   │   └── TrackShare.Api/ # ASP.NET Core API
│   └── frontend/
│       └── public/         # Static web files
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## API Usage

### Upload Track

```bash
curl -X POST http://localhost:8080/api/tracks/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345" \
  -d '{
    "id": "my-track-123",
    "gpxContent": "<gpx>...</gpx>"
  }'
```

### View Track

Open in browser:
```
http://localhost/track.html?id=my-track-123
```

### Delete Track

```bash
curl -X DELETE http://localhost:8080/api/tracks/my-track-123 \
  -H "X-API-Key: dev-api-key-12345"
```

See [API_REFERENCE.md](src/backend/API_REFERENCE.md) for complete API documentation.

## Development

### Backend

```bash
cd src/backend/TrackShare.Api
dotnet restore
dotnet run
```

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```

See individual README files in each directory for detailed development instructions.

## Documentation

- **[Architecture Documentation](docs/arc42/)** - Arc42 architecture documentation
- **[API Reference](src/backend/API_REFERENCE.md)** - Complete REST API documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[Entity Specification](docs/entities/entities.md)** - Database schema
- **[Backend Implementation](docs/ai/backend_implementation.md)** - Backend architecture details
- **[Frontend Implementation](docs/ai/frontend_implementation.md)** - Frontend architecture details

## Requirements

- Docker or Podman
- Docker Compose
- .NET 8 SDK (for development)
- Node.js 18+ (for frontend development)

## License

See [LICENSE](LICENSE) file for details.

## Related Projects

This project is part of the myTracks ecosystem:
- [myTracks for iOS](https://apps.apple.com/app/mytracks/id358697908)
- [myTracks for macOS](https://www.mytracks4mac.info)

## Support

For issues and questions:
1. Check the [documentation](docs/)
2. Review the [API reference](src/backend/API_REFERENCE.md)
3. See [troubleshooting guide](DEPLOYMENT.md#troubleshooting)

---

**Note**: This repository contains only the backend and frontend for track sharing. The myTracks apps are separate projects.
