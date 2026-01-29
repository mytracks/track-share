#!/bin/sh

docker tag ghcr.io/mytracks/trackshare-backend:latest ghcr.io/mytracks/trackshare-backend:2026-01-26
docker push ghcr.io/mytracks/trackshare-backend:2026-01-26

docker tag ghcr.io/mytracks/trackshare-frontend:latest ghcr.io/mytracks/trackshare-frontend:2026-01-26
docker push ghcr.io/mytracks/trackshare-frontend:2026-01-26

scp podman/*.container gis@vps-08.mytracks4mac.info:.config/containers/systemd/
ssh gis@vps-08.mytracks4mac.info "systemctl --user daemon-reload"
#ssh gis@vps-08.mytracks4mac.info "systemctl --user enable trackshare-database.service"
