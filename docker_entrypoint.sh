#!/bin/sh
set -e

echo "Running custom initialization..."
composer auto-script

echo "Starting php-fpm..."
exec "$@"