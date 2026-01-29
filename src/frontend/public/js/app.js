/**
 * TrackShare Frontend Application
 * Displays GPX tracks on an interactive map using MapLibre GL JS
 */

// Configuration
const API_BASE_URL = window.CONFIG?.API_BASE_URL || 
    (window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api'
        : '/api');

// DOM Elements
const map = document.getElementById('map');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const infoPanel = document.getElementById('info-panel');
const trackName = document.getElementById('track-name');
const distanceEl = document.getElementById('distance');
const durationEl = document.getElementById('duration');
// const elevationGainEl = document.getElementById('elevation-gain');
// const elevationLossEl = document.getElementById('elevation-loss');

// Global variables
let maplibreMap = null;
let trackSource = null;

/**
 * Initialize the application
 */
function init() {
    const trackId = getTrackIdFromUrl();
    
    if (!trackId) {
        showError('No track ID provided', 'Please check your URL and try again.');
        return;
    }
    
    // Initialize the map
    initMap();
    
    // Load and display the track
    loadTrack(trackId);
}

/**
 * Get track ID from URL query parameters
 * @returns {string|null} The track ID or null if not found
 */
function getTrackIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Initialize the MapLibre GL JS map
 */
function initMap() {
    maplibreMap = new maplibregl.Map({
        container: 'map',
        style: 'https://tilenew.mytracks4mac.info/styles/osm/style.json',
        center: [8.5417, 47.3769], // Default: Zurich [lng, lat]
        zoom: 13
    });
    
    // Add navigation controls
    maplibreMap.addControl(new maplibregl.NavigationControl(), 'top-right');
}

/**
 * Load track data from the API
 * @param {string} trackId - The ID of the track to load
 */
async function loadTrack(trackId) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Track not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse and display the GPX content
        parseAndDisplayGpx(data.gpxContent);
        
        hideLoading();
    } catch (err) {
        console.error('Error loading track:', err);
        hideLoading();
        
        if (err.message === 'Track not found') {
            showError('Track Not Found', 'The requested track could not be found. Please check the URL and try again.');
        } else {
            showError('Error Loading Track', `Failed to load the track: ${err.message}`);
        }
    }
}

/**
 * Parse GPX content and display it on the map
 * @param {string} gpxContent - The GPX XML content
 */
function parseAndDisplayGpx(gpxContent) {
    try {
        const parser = new DOMParser();
        const gpxDoc = parser.parseFromString(gpxContent, 'text/xml');
        
        // Check for parsing errors
        const parserError = gpxDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid GPX format');
        }
        
        // Extract track name
        const nameElement = gpxDoc.querySelector('trk > name');
        const trackNameText = nameElement ? nameElement.textContent : 'Unnamed Track';
        trackName.textContent = trackNameText;
        
        // Extract track points
        const trackPoints = extractTrackPoints(gpxDoc);
        
        if (trackPoints.length === 0) {
            throw new Error('No track points found in GPX');
        }
        
        // Display the track on the map
        displayTrack(trackPoints);
        
        // Calculate and display statistics
        const stats = calculateTrackStatistics(trackPoints);
        displayStatistics(stats);
        
        // Show info panel
        infoPanel.classList.remove('hidden');
        
    } catch (err) {
        console.error('Error parsing GPX:', err);
        showError('Invalid Track Data', `Failed to parse the track data: ${err.message}`);
    }
}

/**
 * Extract track points from GPX document
 * @param {Document} gpxDoc - The parsed GPX document
 * @returns {Array} Array of track points with lat, lng, elevation, and time
 */
function extractTrackPoints(gpxDoc) {
    const points = [];
    const trkpts = gpxDoc.querySelectorAll('trkpt');
    
    trkpts.forEach(trkpt => {
        const lat = parseFloat(trkpt.getAttribute('lat'));
        const lon = parseFloat(trkpt.getAttribute('lon'));
        
        const eleElement = trkpt.querySelector('ele');
        const timeElement = trkpt.querySelector('time');
        
        const elevation = eleElement ? parseFloat(eleElement.textContent) : null;
        const time = timeElement ? new Date(timeElement.textContent) : null;
        
        points.push({ lat, lng: lon, elevation, time });
    });
    
    return points;
}

/**
 * Display track on the map
 * @param {Array} trackPoints - Array of track points
 */
function displayTrack(trackPoints) {
    // Convert to GeoJSON LineString format [lng, lat]
    const coordinates = trackPoints.map(point => [point.lng, point.lat]);
    
    // Function to add track to map
    const addTrackToMap = () => {
        // Add track source
        if (maplibreMap.getSource('track')) {
            maplibreMap.getSource('track').setData({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        } else {
            maplibreMap.addSource('track', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                }
            });
            
            // Add track layer
            maplibreMap.addLayer({
                id: 'track-line',
                type: 'line',
                source: 'track',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3498db',
                    'line-width': 4,
                    'line-opacity': 0.8
                }
            });
        }
        
        // Add start marker
        new maplibregl.Marker({ color: '#27ae60' })
            .setLngLat(coordinates[0])
            .setPopup(new maplibregl.Popup().setText('Start'))
            .addTo(maplibreMap);
        
        // Add end marker
        new maplibregl.Marker({ color: '#e74c3c' })
            .setLngLat(coordinates[coordinates.length - 1])
            .setPopup(new maplibregl.Popup().setText('End'))
            .addTo(maplibreMap);
        
        // Fit map bounds to track
        const bounds = coordinates.reduce(
            (bounds, coord) => bounds.extend(coord),
            new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
        );
        
        maplibreMap.fitBounds(bounds, { padding: 50 });
    };
    
    // Wait for the map to load if not already loaded
    if (maplibreMap.loaded()) {
        addTrackToMap();
    } else {
        maplibreMap.on('load', addTrackToMap);
    }
}

/**
 * Calculate track statistics
 * @param {Array} trackPoints - Array of track points
 * @returns {Object} Track statistics
 */
function calculateTrackStatistics(trackPoints) {
    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    
    for (let i = 1; i < trackPoints.length; i++) {
        const prev = trackPoints[i - 1];
        const curr = trackPoints[i];
        
        // Calculate distance
        totalDistance += calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        
        // Calculate elevation changes
        if (prev.elevation !== null && curr.elevation !== null) {
            const elevDiff = curr.elevation - prev.elevation;
            if (elevDiff > 0) {
                elevationGain += elevDiff;
            } else {
                elevationLoss += Math.abs(elevDiff);
            }
        }
    }
    
    // Calculate duration
    let duration = null;
    const firstTime = trackPoints.find(p => p.time)?.time;
    const lastTime = [...trackPoints].reverse().find(p => p.time)?.time;
    
    if (firstTime && lastTime) {
        duration = (lastTime - firstTime) / 1000; // Duration in seconds
    }
    
    return {
        distance: totalDistance,
        duration: duration,
        elevationGain: elevationGain,
        elevationLoss: elevationLoss
    };
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

/**
 * Display track statistics in the info panel
 * @param {Object} stats - Track statistics
 */
function displayStatistics(stats) {
    // Distance
    if (stats.distance > 0) {
        const distanceKm = (stats.distance / 1000).toFixed(2);
        distanceEl.textContent = `${distanceKm} km`;
    }
    
    // Duration
    if (stats.duration !== null) {
        durationEl.textContent = formatDuration(stats.duration);
    } else {
        durationEl.textContent = 'N/A';
    }
    
    // Elevation gain
    // if (stats.elevationGain > 0) {
    //     elevationGainEl.textContent = `${Math.round(stats.elevationGain)} m`;
    // } else {
    //     elevationGainEl.textContent = 'N/A';
    // }
    
    // Elevation loss
    // if (stats.elevationLoss > 0) {
    //     elevationLossEl.textContent = `${Math.round(stats.elevationLoss)} m`;
    // } else {
    //     elevationLossEl.textContent = 'N/A';
    // }
}

/**
 * Format duration in seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

/**
 * Show loading indicator
 */
function showLoading() {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    loading.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
function showError(title, message) {
    error.querySelector('h2').textContent = title;
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
