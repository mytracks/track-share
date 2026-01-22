# Frontend Implementation

This document describes the implementation decisions and architectural principles for the TrackShare frontend.

## Overview

The frontend is a single-page application (SPA) that displays GPX tracks on an interactive map. It is built using vanilla JavaScript (no frameworks) for simplicity and minimal dependencies.

## Technology Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with flexbox and grid layouts
- **JavaScript (ES6+)**: Application logic and API interaction
- **Leaflet.js**: Interactive map library
- **OpenStreetMap**: Map tile provider
- **nginx**: Web server for serving static files

## Architecture

### File Structure

```
src/frontend/
├── public/
│   ├── index.html          # Landing page
│   ├── track.html          # Track viewer page
│   ├── 50x.html            # Error page
│   └── js/
│       └── app.js          # Main application logic
├── Dockerfile              # Container image definition
├── nginx.conf              # nginx configuration
├── package.json            # npm configuration (for dev server)
└── README.md               # Frontend documentation
```

### Design Principles

1. **Simplicity**: No complex build process or framework dependencies
2. **Performance**: Minimal JavaScript, efficient GPX parsing
3. **Responsive**: Mobile-first design with desktop support
4. **Accessibility**: Semantic HTML and proper ARIA labels
5. **Error Handling**: Clear error messages and fallback states

## Key Components

### Track Viewer (track.html + app.js)

The main component that:
1. Extracts track ID from URL query parameters
2. Fetches track data from the backend API
3. Parses GPX XML content
4. Displays the track on an interactive Leaflet map
5. Calculates and displays track statistics

**Features:**
- Interactive map with pan and zoom
- Track polyline visualization
- Start and end markers
- Distance calculation using Haversine formula
- Elevation gain/loss calculation
- Duration calculation from timestamps
- Mobile-responsive layout

### API Integration

The frontend communicates with the backend REST API:

```javascript
// API endpoint configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5032/api'  // Development
    : '/api';                       // Production (via nginx proxy)
```

**Endpoints used:**
- `GET /api/tracks/{id}` - Fetch track data

### GPX Parsing

The application uses the browser's native DOMParser to parse GPX XML:

```javascript
const parser = new DOMParser();
const gpxDoc = parser.parseFromString(gpxContent, 'text/xml');
```

**Extracted data:**
- Track name (`<trk><name>`)
- Track points (`<trkpt>` with `lat`, `lon` attributes)
- Elevation data (`<ele>`)
- Timestamps (`<time>`)

### Map Integration

Uses Leaflet.js for map rendering:

```javascript
// Initialize map
leafletMap = L.map('map').setView([47.3769, 8.5417], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(leafletMap);

// Display track as polyline
trackLayer = L.polyline(latlngs, {
    color: '#3498db',
    weight: 4,
    opacity: 0.8
}).addTo(leafletMap);
```

### Statistics Calculation

**Distance:**
- Uses Haversine formula for great-circle distance
- Calculated between consecutive track points
- Displayed in kilometers

**Duration:**
- Extracted from first and last timestamp in GPX
- Formatted as hours, minutes, and seconds

**Elevation:**
- Calculates total gain and loss
- Accumulates positive/negative differences between points

## Deployment

### Docker Container

The frontend is packaged as a Docker container using nginx:

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
```

### nginx Configuration

- Serves static files from `/usr/share/nginx/html/`
- Proxies API requests to backend container
- Enables gzip compression
- Sets security headers
- Caches static assets for 1 year

### Docker Compose Integration

The frontend service is defined in the backend's docker-compose.yml:

```yaml
frontend:
  build:
    context: ../frontend
    dockerfile: Dockerfile
  container_name: trackshare-frontend
  ports:
    - "80:80"
  depends_on:
    - backend
```

## Development

### Local Development

```bash
cd src/frontend
npm install
npm run dev
```

This starts a local development server on port 8080.

### Testing

Manual testing checklist:
- [ ] Track loads and displays on map
- [ ] Start and end markers are visible
- [ ] Map is properly bounded to track
- [ ] Statistics are calculated correctly
- [ ] Error handling works (invalid ID, network errors)
- [ ] Mobile responsive layout works
- [ ] Browser back/forward navigation works

## Browser Support

Tested and supported browsers:
- Chrome/Edge (Chromium) 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Security Considerations

1. **No authentication required**: Tracks are public by design
2. **XSS Protection**: Content Security Policy headers via nginx
3. **Input validation**: Track IDs are validated on backend
4. **CORS**: Handled by nginx proxy in production
5. **HTTPS**: Enforced in production via reverse proxy

## Future Enhancements

Potential improvements for future versions:
- [ ] Elevation profile chart
- [ ] Track animation/playback
- [ ] Download GPX file
- [ ] Share via social media
- [ ] QR code generation
- [ ] Multiple track overlays
- [ ] Track comparison
- [ ] Custom map styles
- [ ] Offline map caching
- [ ] Progressive Web App (PWA) support

## Performance Metrics

Target performance metrics:
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 100KB (excluding libraries)

## Accessibility

- Semantic HTML elements
- Proper heading hierarchy
- Alt text for images (if added)
- Color contrast ratio > 4.5:1
- Keyboard navigation support
- Screen reader friendly error messages

## Related Documentation

- [Backend API Reference](../backend/API_REFERENCE.md)
- [Entity Specification](../../docs/entities/entities.md)
- [Architecture Documentation](../../docs/arc42/)
