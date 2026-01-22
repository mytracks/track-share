# TrackShare Deployment Guide

Complete guide for deploying the TrackShare application (backend + frontend).

## Prerequisites

- Docker or Podman installed
- Docker Compose installed
- Ports 80, 8080, and 5432 available

## Quick Start

### Using Docker Compose (Recommended)

From the backend directory, run:

```bash
cd src/backend
docker-compose up -d
```

This will start:
- **PostgreSQL** database on port 5432
- **Backend API** on port 8080
- **Frontend** web server on port 80

### Access the Application

- **Frontend**: http://localhost/
- **Track Viewer**: http://localhost/track.html?id=YOUR_TRACK_ID
- **Backend API**: http://localhost:8080/api/tracks

## Development Setup

### Backend Development

```bash
cd src/backend/TrackShare.Api
dotnet restore
dotnet run
```

Backend will be available at http://localhost:5032

### Frontend Development

```bash
cd src/frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:8080

**Note**: When developing, update the API_BASE_URL in `public/js/app.js` to point to the backend.

## Testing the Application

### 1. Upload a Test Track

```bash
curl -X POST http://localhost:8080/api/tracks/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345" \
  -d '{
    "id": "test-track-001",
    "gpxContent": "<?xml version=\"1.0\"?><gpx version=\"1.1\" creator=\"test\"><trk><name>Test Track</name><trkseg><trkpt lat=\"47.3769\" lon=\"8.5417\"><ele>408</ele><time>2026-01-22T10:00:00Z</time></trkpt><trkpt lat=\"47.3779\" lon=\"8.5427\"><ele>410</ele><time>2026-01-22T10:05:00Z</time></trkpt></trkseg></trk></gpx>"
  }'
```

### 2. View the Track

Open in browser: http://localhost/track.html?id=test-track-001

### 3. Delete the Track

```bash
curl -X DELETE http://localhost:8080/api/tracks/test-track-001 \
  -H "X-API-Key: dev-api-key-12345"
```

## Production Deployment

### Environment Variables

Update docker-compose.yml for production:

```yaml
backend:
  environment:
    ASPNETCORE_ENVIRONMENT: Production
    ConnectionStrings__DefaultConnection: "Host=postgres;Database=trackshare;Username=your_user;Password=your_secure_password"
    ApiKey: "your-secure-api-key-here"
```

### Reverse Proxy (Traefik)

Add Traefik labels to docker-compose.yml:

```yaml
frontend:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.trackshare.rule=Host(`trackshare.yourdomain.com`)"
    - "traefik.http.routers.trackshare.entrypoints=websecure"
    - "traefik.http.routers.trackshare.tls.certresolver=letsencrypt"
```

### Security Considerations

1. **Change default passwords** in docker-compose.yml
2. **Use strong API key** for production
3. **Enable HTTPS** via reverse proxy
4. **Restrict database access** to backend only
5. **Set up backup** for PostgreSQL data volume

## Monitoring

### Check Service Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Access

```bash
docker exec -it trackshare-postgres psql -U postgres -d trackshare
```

## Troubleshooting

### Backend Not Starting

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Database not ready (wait for healthcheck)
- Port 8080 already in use
- Invalid connection string

### Frontend Not Loading

Check nginx logs:
```bash
docker-compose logs frontend
```

Common issues:
- Port 80 already in use (requires sudo/root)
- Backend not accessible
- nginx configuration syntax error

### Database Connection Issues

Verify database is running:
```bash
docker-compose exec postgres pg_isready -U postgres
```

### Track Not Displaying

Check browser console for errors:
- F12 → Console tab
- Look for fetch errors or CORS issues

Common issues:
- Track ID doesn't exist
- Invalid GPX format
- API endpoint not accessible

## Performance Tuning

### nginx Caching

Already configured in nginx.conf:
- Static assets cached for 1 year
- Gzip compression enabled

### Database Optimization

For production, consider:
- Indexing on Track.Id (already primary key)
- Connection pooling (configured in backend)
- Regular VACUUM operations

### Scaling

Horizontal scaling options:
- Multiple backend instances behind load balancer
- Shared PostgreSQL database
- Static frontend served via CDN

## Backup and Restore

### Backup Database

```bash
docker exec trackshare-postgres pg_dump -U postgres trackshare > backup.sql
```

### Restore Database

```bash
docker exec -i trackshare-postgres psql -U postgres trackshare < backup.sql
```

### Backup Docker Volumes

```bash
docker run --rm -v trackshare_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz /data
```

## Updating

### Update Application

```bash
cd src/backend
docker-compose down
git pull
docker-compose build
docker-compose up -d
```

### Update Dependencies

Backend:
```bash
cd src/backend/TrackShare.Api
dotnet restore
```

Frontend:
```bash
cd src/frontend
npm update
```

## Uninstalling

### Stop Services

```bash
cd src/backend
docker-compose down
```

### Remove Volumes (WARNING: Deletes all data)

```bash
docker-compose down -v
```

## Additional Resources

- [Backend API Reference](API_REFERENCE.md)
- [Frontend Documentation](../frontend/README.md)
- [Architecture Documentation](../../docs/arc42/)
- [Entity Specification](../../docs/entities/entities.md)
