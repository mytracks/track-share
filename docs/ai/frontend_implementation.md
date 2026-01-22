# Frontend Implementation Principles

## Overview

This document describes the architectural principles and implementation decisions for the TrackShare frontend. It serves as a guide for AI agents working on the frontend codebase.

## Core Principles

### 1. Simplicity First

The frontend is intentionally simple:
- **No Framework**: Uses vanilla JavaScript (ES6+) to minimize complexity
- **No Build Step**: Direct file serving without transpilation or bundling
- **Minimal Dependencies**: Only Leaflet.js for maps, loaded via CDN
- **Standard Web APIs**: DOMParser for XML, Fetch API for HTTP

**Rationale**: The application has a single, focused purpose (display tracks). A framework would add unnecessary complexity.

### 2. Progressive Enhancement

The application is designed to work across devices:
- **Mobile-First**: CSS designed for small screens first
- **Responsive Layout**: Flexbox and grid for adaptive layouts
- **Touch-Friendly**: Large touch targets, swipe gestures via Leaflet

### 3. Error Handling

Comprehensive error handling at all levels:
- **Network Errors**: Fetch failures, timeout handling
- **Data Errors**: Invalid GPX, missing track points
- **User Feedback**: Clear error messages in UI
- **Graceful Degradation**: Missing data (elevation, time) handled gracefully

### 4. Performance

Optimizations for fast loading:
- **CDN Resources**: Leaflet.js served from CDN with integrity checks
- **Gzip Compression**: nginx configured for text compression
- **Asset Caching**: 1-year cache for static assets
- **Efficient Parsing**: Single-pass GPX parsing

## Implementation Details

### API Communication

```javascript
// Configuration adapts to environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5032/api'  // Dev: Direct backend
    : '/api';                       // Prod: nginx proxy
```

**Key Points:**
- Development: Direct access to backend on port 5032
- Production: Proxied through nginx to avoid CORS
- No API key required for GET requests (read-only)

### GPX Parsing Strategy

**Single-Pass Parsing:**
```javascript
// Extract all data in one iteration
const trkpts = gpxDoc.querySelectorAll('trkpt');
trkpts.forEach(trkpt => {
    // Extract lat, lon, elevation, time in single pass
});
```

**Robustness:**
- Handles missing elevation data
- Handles missing timestamps
- Validates GPS coordinates
- Detects empty tracks

### Statistics Calculation

**Distance (Haversine Formula):**
- Accurate great-circle distance
- Accounts for Earth's curvature
- Precision: ±0.5% for typical track lengths

**Elevation:**
- Separate gain/loss tracking
- Smoothing not applied (raw data)
- Handles missing elevation gracefully

**Duration:**
- Extracted from GPX timestamps
- Falls back to "N/A" if no timestamps
- Displayed in human-readable format

### Map Rendering

**Leaflet Integration:**
```javascript
// Track displayed as polyline
L.polyline(latlngs, {
    color: '#3498db',      // Blue
    weight: 4,             // 4px width
    opacity: 0.8           // 80% opacity
}).addTo(leafletMap);
```

**Markers:**
- Green circle: Start point
- Red circle: End point
- Popup on click with "Start"/"End" labels

**Auto-Fitting:**
- Map bounds automatically fit to track
- 50px padding on all sides
- Preserves aspect ratio

## Styling Guidelines

### CSS Architecture

**No CSS Framework**: Custom CSS for full control

**Layout System:**
- Flexbox for 1D layouts (header, info panel)
- Grid for 2D layouts (statistics grid)
- Percentage and viewport units for responsiveness

**Color Palette:**
```css
Primary:    #3498db  /* Blue */
Success:    #27ae60  /* Green */
Error:      #e74c3c  /* Red */
Dark:       #2c3e50  /* Navy */
Light:      #f5f5f5  /* Light gray */
```

**Typography:**
- System font stack for native feel
- 16px base font size
- 1.6 line-height for readability

### Responsive Breakpoints

```css
@media (max-width: 768px) {
    /* Mobile adjustments */
}
```

**Single breakpoint at 768px:**
- Desktop: Full layout
- Mobile: Compressed info panel, 2-column stats

## Docker Deployment

### nginx Configuration

**Key Features:**
1. **Static File Serving**: Efficient file serving from `/usr/share/nginx/html/`
2. **API Proxying**: `/api/*` proxied to backend container
3. **Gzip Compression**: Text files compressed automatically
4. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
5. **Cache Control**: Long-term caching for static assets

**Proxy Configuration:**
```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Docker Image

**Base Image**: `nginx:alpine`
- Minimal size (~5MB)
- Security updates from Alpine
- Production-grade web server

**Build Process:**
```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
```

## Constraints for AI Agents

### Allowed Actions

✅ **You may:**
- Modify files in `src/frontend/`
- Update styling and layout
- Add new features (within scope)
- Improve error handling
- Optimize performance
- Update documentation in `docs/ai/`

### Prohibited Actions

❌ **You must not:**
- Add framework dependencies (React, Vue, Angular, etc.)
- Modify files outside `src/frontend/` or `docs/ai/`
- Change the core architecture (vanilla JS, nginx)
- Add authentication to frontend (backend concern)
- Store sensitive data in frontend
- Modify `docs/arc42/` (architectural constraints)

### API Contract

**Dependency on Backend:**
- GET `/api/tracks/{id}` returns `{ id, uploadDate, gpxContent }`
- No authentication required for read operations
- 404 response for missing tracks
- Standard HTTP status codes

**If backend API changes:**
- Update `src/frontend/public/js/app.js`
- Update this document (`docs/ai/frontend_implementation.md`)
- Do not modify backend code

## Testing Guidelines

### Manual Testing Checklist

Before committing changes, verify:

1. **Functionality:**
   - [ ] Track loads with valid ID
   - [ ] Error shown for invalid ID
   - [ ] Map displays correctly
   - [ ] Statistics calculate correctly

2. **Responsiveness:**
   - [ ] Desktop layout (>768px)
   - [ ] Mobile layout (<768px)
   - [ ] Touch interactions work

3. **Browser Compatibility:**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari

4. **Error Handling:**
   - [ ] Network failure handled
   - [ ] Invalid GPX handled
   - [ ] Missing data handled

### Development Testing

```bash
# Start backend
cd src/backend
docker-compose up -d

# Start frontend
cd src/frontend
npm install
npm run dev

# Test URL
open http://localhost:8080/track.html?id=test-track
```

## Maintenance

### Regular Tasks

- **Dependency Updates**: Check Leaflet.js versions monthly
- **Browser Testing**: Test on latest browser versions
- **Security Headers**: Review nginx security headers quarterly
- **Performance**: Monitor page load times

### Version Management

- Leaflet.js version pinned in HTML (integrity hash)
- nginx base image tagged (`:alpine`)
- Node.js version specified in package.json

## Related Documents

- [Solution Strategy](../../docs/arc42/04_solution_strategy.md) - Overall architecture
- [Backend Implementation](../backend/IMPLEMENTATION.md) - Backend architecture
- [API Reference](../backend/API_REFERENCE.md) - API documentation
- [Entity Specification](../../docs/entities/entities.md) - Data models
