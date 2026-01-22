# TrackShare Frontend

Web frontend for viewing shared GPX tracks on an interactive map.

## Features

- Display GPX tracks on an interactive OpenStreetMap
- Pan and zoom the map
- View track details (distance, duration, elevation)
- Responsive design for mobile and desktop
- Error handling for missing or invalid tracks

## Technology Stack

- Plain HTML, CSS, and JavaScript (no framework required)
- Leaflet.js for interactive maps
- OpenStreetMap tiles
- nginx for serving static files

## Development

For local development:

```bash
npm install
npm run dev
```

Visit `http://localhost:8080/track.html?id=<track-id>`

## Docker Deployment

The frontend is served by nginx in a Docker container:

```bash
docker build -t trackshare-frontend .
docker run -p 8080:80 trackshare-frontend
```

## URL Structure

The frontend expects track IDs to be passed as query parameters:
- `http://localhost:8080/track.html?id=<track-id>`

Example:
- `http://localhost:8080/track.html?id=my-morning-run`
