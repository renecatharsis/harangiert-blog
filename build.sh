#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process..."

COMPOSER="composer:2.10.2" # make sure the php version of this image matches our Dockerfile base
NODE="node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205"

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
  bash -c "corepack prepare pnpm@10.34.7 --activate && corepack enable && pnpm install && pnpm build && rm -rf node_modules"

docker run --rm \
  -v "$(pwd)/app":/opt/app \
  -w /opt/app/assets/website \
  "$NODE" \
  bash -c "corepack prepare pnpm@12.15.0 --activate && corepack enable && pnpm install && pnpm build && rm -rf node_modules"

# remove local composer vendor directory
rm -rf app/vendor/

echo "Cleaning up Docker image..."
docker rmi -f "$NODE" || echo "Could not remove image $NODE (it may be in use or already removed)."
docker rmi -f "$COMPOSER" || echo "Could not remove image $COMPOSER (it may be in use or already removed)."

echo "Build completed successfully."