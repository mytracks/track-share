/**
 * TrackShare Frontend Application
 * Displays GPX tracks on an interactive map using Leaflet.js
 */

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/api'
    : '/api';

// DOM Elements
const map = document.getElementById('map');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const infoPanel = document.getElementById('info-panel');
const trackName = document.getElementById('track-name');
const distanceEl = document.getElementById('distance');
const durationEl = document.getElementById('duration');
const elevationGainEl = document.getElementById('elevation-gain');
const elevationLossEl = document.getElementById('elevation-loss');

// Global variables
let leafletMap = null;
let trackLayer = null;

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
 * Initialize the Leaflet map
 */
function initMap() {
    leafletMap = L.map('map').setView([47.3769, 8.5417], 13); // Default: Zurich
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(leafletMap);
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
    // Convert to Leaflet LatLng format
    const latlngs = trackPoints.map(point => [point.lat, point.lng]);
    
    // Remove existing track layer if any
    if (trackLayer) {
        leafletMap.removeLayer(trackLayer);
    }
    
    // Create a polyline for the track
    trackLayer = L.polyline(latlngs, {
        color: '#3498db',
        weight: 4,
        opacity: 0.8
    }).addTo(leafletMap);
    
    // Add start marker
    const startMarker = L.circleMarker(latlngs[0], {
        radius: 8,
        fillColor: '#27ae60',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(leafletMap);
    startMarker.bindPopup('Start');
    
    // Add end marker
    const endMarker = L.circleMarker(latlngs[latlngs.length - 1], {
        radius: 8,
        fillColor: '#e74c3c',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(leafletMap);
    endMarker.bindPopup('End');
    
    // Fit map bounds to track
    leafletMap.fitBounds(trackLayer.getBounds(), { padding: [50, 50] });
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
    if (stats.elevationGain > 0) {
        elevationGainEl.textContent = `${Math.round(stats.elevationGain)} m`;
    } else {
        elevationGainEl.textContent = 'N/A';
    }
    
    // Elevation loss
    if (stats.elevationLoss > 0) {
        elevationLossEl.textContent = `${Math.round(stats.elevationLoss)} m`;
    } else {
        elevationLossEl.textContent = 'N/A';
    }
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
