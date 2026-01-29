# TrackShare Backend

This is the backend service for the TrackShare application, built with .NET 8 and ASP.NET Core.

## Features

- REST API for uploading and managing GPS tracks
- PostgreSQL database using Entity Framework Core
- Repository pattern for data access
- API key authentication for write operations
- Docker support for easy deployment

## Architecture

The backend follows a layered architecture:

- **Controllers**: HTTP API endpoints
- **Repositories**: Data access layer using the repository pattern
- **Entities**: Domain models
- **Data**: Entity Framework Core database context
- **Authentication**: API key middleware for securing write operations

## API Endpoints

### Upload Track

- **POST** `/api/tracks/upload`
- **Headers**: `X-API-Key: <your-api-key>`
- **Body**:
  ```json
  {
    "id": "unique-track-identifier",
    "gpxContent": "<gpx>...</gpx>"
  }
  ```
- **Response**: HTTP 200 OK

### Get Track

- **GET** `/api/tracks/{id}`
- **Response**: HTTP 200 OK with track data

### Delete Track

- **DELETE** `/api/tracks/{id}`
- **Headers**: `X-API-Key: <your-api-key>`
- **Response**: HTTP 200 OK

## Configuration

The application uses `appsettings.json` and `appsettings.Development.json` for configuration.

Key settings:

- **ConnectionStrings:DefaultConnection**: PostgreSQL connection string
- **ApiKey**: API key for authenticating write operations

## Database

The application uses PostgreSQL as the database. Entity Framework Core is used as the ORM.

**Automatic Migrations**: The application automatically applies pending database migrations on startup, so you don't need to run migrations manually when deploying or starting the container.

### Migrations

Create a new migration:
```bash
dotnet ef migrations add <MigrationName>
```

Manually apply migrations (optional, as they run automatically on startup):
```bash
dotnet ef database update
```

## Running the Application

### Prerequisites

- .NET 8 SDK
- PostgreSQL database

### Local Development

1. Update the connection string in `appsettings.Development.json`
2. Run the application (migrations will run automatically on startup):
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5000` (or the port specified in launchSettings.json).

### Docker

Build the Docker image:
```bash
docker build -t trackshare-backend -f Dockerfile .
```

Run the container:
```bash
docker run -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Host=postgres;Database=trackshare;Username=postgres;Password=postgres" \
  -e ApiKey="your-api-key" \
  trackshare-backend
```

## Authentication

The API uses API key authentication for write operations (POST, PUT, DELETE). Read operations (GET) do not require authentication.

To authenticate, include the API key in the request header:
```
X-API-Key: your-api-key
```

## Entity Model

### Track

- **Id** (string, max 256 chars): Unique identifier provided by the client
- **UploadDate** (DateTime): Upload timestamp
- **GpxContent** (string): Raw GPX XML content

## Security Notes

- The API key should be kept secret and rotated regularly
- In production, use environment variables to store sensitive configuration
- HTTPS should be used in production (TLS termination is handled by traefik)

## Future Enhancements

- Track expiration after 30 days (scheduled job)
- GPX validation
- Track statistics extraction
- Rate limiting
