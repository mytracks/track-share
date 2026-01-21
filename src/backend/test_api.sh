#!/bin/bash

# Test script for TrackShare backend API

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "Testing TrackShare Backend API"
echo "Base URL: $BASE_URL"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" | jq .
echo ""

# Test upload endpoint with sample GPX
echo "2. Testing track upload..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test-track-001",
    "gpxContent": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx version=\"1.1\" creator=\"myTracks\"><trk><name>Test Track</name><trkseg><trkpt lat=\"47.5\" lon=\"8.5\"><ele>400</ele></trkpt></trkseg></trk></gpx>"
  }')
echo "$RESPONSE" | jq .
echo ""

# Test updating the same track
echo "3. Testing track update..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test-track-001",
    "gpxContent": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx version=\"1.1\" creator=\"myTracks\"><trk><name>Updated Test Track</name><trkseg><trkpt lat=\"47.5\" lon=\"8.5\"><ele>450</ele></trkpt></trkseg></trk></gpx>"
  }')
echo "$RESPONSE" | jq .
echo ""

# Test validation - empty identifier
echo "4. Testing validation (empty identifier)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "",
    "gpxContent": "test content"
  }')
echo "$RESPONSE" | jq .
echo ""

# Test validation - empty GPX content
echo "5. Testing validation (empty GPX content)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test-track-002",
    "gpxContent": ""
  }')
echo "$RESPONSE" | jq .
echo ""

echo "Tests completed!"
