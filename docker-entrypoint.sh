#!/bin/sh
set -e

echo "Making sure cache, assets etc. are initialized at runtime..."
composer auto-scripts

echo "Starting php-fpm..."
exec "$@"