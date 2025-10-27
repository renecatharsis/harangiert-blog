#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process..."

if ! command -v docker &> /dev/null; then
  echo "Error: Docker is not installed or not in PATH."
  exit 1
fi

NODE="node:20"

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

echo "Cleaning up Docker image..."
docker rmi -f "$NODE" || echo "Could not remove image $IMAGE (it may be in use or already removed)."

echo "Build completed successfully."