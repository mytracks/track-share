# TrackShare API Quick Reference

## Base URL
- **Development**: `http://localhost:5032`
- **Docker**: `http://localhost:8080`
- **Production**: `https://your-domain.com` (via traefik)

## Authentication
- **Header**: `X-API-Key: <your-api-key>`
- **Required for**: POST, DELETE
- **Not required for**: GET

## Endpoints

### 📤 Upload Track
```http
POST /api/tracks/upload
Content-Type: application/json
X-API-Key: dev-api-key-12345

{
  "id": "unique-track-id",
  "gpxContent": "<gpx>...</gpx>"
}
```

**Response (200 OK):**
```json
{
  "message": "Track uploaded successfully",
  "trackId": "unique-track-id"
}
```

**Response (400 Bad Request):**
```json
{
  "errors": {
    "Id": ["The Id field is required."],
    "GpxContent": ["The GpxContent field is required."]
  }
}
```

**Response (401 Unauthorized):**
```
API Key is missing
```

---

### 📥 Get Track
```http
GET /api/tracks/{id}
```

**Response (200 OK):**
```json
{
  "id": "unique-track-id",
  "uploadDate": "2026-01-22T17:30:00Z",
  "gpxContent": "<gpx>...</gpx>"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Track not found"
}
```

---

### 🗑️ Delete Track
```http
DELETE /api/tracks/{id}
X-API-Key: dev-api-key-12345
```

**Response (200 OK):**
```json
{
  "message": "Track deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Track not found"
}
```

**Response (401 Unauthorized):**
```
API Key is missing
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid API key |
| 404 | Not Found - Track doesn't exist |
| 500 | Internal Server Error |

## Example GPX Content

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="myTracks">
  <metadata>
    <name>Example Track</name>
    <time>2026-01-22T12:00:00Z</time>
  </metadata>
  <trk>
    <name>Morning Run</name>
    <trkseg>
      <trkpt lat="52.5200" lon="13.4050">
        <ele>34</ele>
        <time>2026-01-22T12:00:00Z</time>
      </trkpt>
      <trkpt lat="52.5210" lon="13.4060">
        <ele>35</ele>
        <time>2026-01-22T12:01:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
```

## cURL Examples

### Upload
```bash
curl -X POST http://localhost:5032/api/tracks/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345" \
  -d '{"id":"track-123","gpxContent":"<gpx>...</gpx>"}'
```

### Get
```bash
curl http://localhost:5032/api/tracks/track-123
```

### Delete
```bash
curl -X DELETE http://localhost:5032/api/tracks/track-123 \
  -H "X-API-Key: dev-api-key-12345"
```

## Configuration

### Development
- API Key: `dev-api-key-12345`
- Database: `localhost:5432/trackshare`

### Production
Set environment variables:
```bash
ConnectionStrings__DefaultConnection="Host=postgres;Database=trackshare;Username=postgres;Password=<secure-password>"
ApiKey="<secure-api-key>"
```

## Swagger/OpenAPI

Access interactive API documentation at:
- Development: `http://localhost:5032/swagger`
- Docker: `http://localhost:8080/swagger`
