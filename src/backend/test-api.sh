#!/bin/bash

# Test script for TrackShare Backend API
# This script tests the upload track endpoint

API_URL="http://localhost:8080"
API_KEY="dev-api-key-12345"
TRACK_ID="test-track-$(date +%s)"

echo "================================================"
echo "TrackShare Backend API Test"
echo "================================================"
echo ""

# Sample GPX content
GPX_CONTENT='<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="myTracks">
  <trk>
    <name>Test Track</name>
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
</gpx>'

echo "Test 1: Upload Track"
echo "Track ID: $TRACK_ID"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{\"id\":\"$TRACK_ID\",\"gpxContent\":\"$(echo "$GPX_CONTENT" | sed 's/"/\\"/g' | tr -d '\n')\"}")

HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "Response Status: $HTTP_STATUS"
echo "Response Body: $HTTP_BODY"
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed!"
    exit 1
fi

echo ""
echo "Test 2: Get Track"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/api/tracks/$TRACK_ID")

HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "Response Status: $HTTP_STATUS"
echo "Response Body (truncated): $(echo "$HTTP_BODY" | cut -c1-200)..."
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Get track successful!"
else
    echo "❌ Get track failed!"
    exit 1
fi

echo ""
echo "Test 3: Delete Track"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$API_URL/api/tracks/$TRACK_ID" \
  -H "X-API-Key: $API_KEY")

HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')
HTTP_STATUS=$(echo "$RESPONSE" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')

echo "Response Status: $HTTP_STATUS"
echo "Response Body: $HTTP_BODY"
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Delete successful!"
else
    echo "❌ Delete failed!"
    exit 1
fi

echo ""
echo "================================================"
echo "All tests passed! ✅"
echo "================================================"
