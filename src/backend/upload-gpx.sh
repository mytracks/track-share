#!/bin/bash

# Test script for TrackShare Backend API

#API_URL="http://localhost:8080"
API_URL="https://trackshareapi.mytracks4mac.info"
#API_KEY="dev-api-key-12345"
TRACK_ID="test-track-12345"

# Sample GPX content
GPX_CONTENT=$(< test-track.gpx)

echo "Upload Track"
echo "Track ID: $TRACK_ID"
echo ""

# Create a temporary JSON file to avoid argument list too long error
TEMP_JSON=$(mktemp)
jq -n --arg id "$TRACK_ID" --rawfile gpx test-track.gpx '{id: $id, gpxContent: $gpx}' > "$TEMP_JSON"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/api/tracks/upload" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  --data-binary "@$TEMP_JSON")

rm -f "$TEMP_JSON"

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
