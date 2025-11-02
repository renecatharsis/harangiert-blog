#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process..."

NODE="node:20"
COMPOSER="composer:2.8.12" # make sure the php version of this image matches our Dockerfile base

# admin build required scripts from sulu's vendor directory
docker run --rm \
  -v "$(pwd)/app":/opt/app \
  -w /opt/app \
  "$COMPOSER" \
  bash -c "composer install --no-scripts --no-dev --optimize-autoloader"

docker run --rm \
  -v "$(pwd)/app":/opt/app \
  -w /opt/app/assets/admin \
  "$NODE" \
  bash -c "npm install && npm run build && rm -rf node_modules"

docker run --rm \
  -v "$(pwd)/app":/opt/app \
  -w /opt/app/assets/website \
  "$NODE" \
  bash -c "npm install && npm run build && rm -rf node_modules"

# remove local composer vendor directory
rm -rf app/vendor/

echo "Cleaning up Docker image..."
docker rmi -f "$NODE" || echo "Could not remove image $NODE (it may be in use or already removed)."
docker rmi -f "$COMPOSER" || echo "Could not remove image $COMPOSER (it may be in use or already removed)."

echo "Build completed successfully."