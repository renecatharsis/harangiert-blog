#!/bin/sh
set -e

echo "Making sure cache, assets etc. are initialized at runtime..."
composer auto-scripts
chmod -R 777 var/log/*
chmod -R 777 var/cache/*

echo "Starting php-fpm..."
exec "$@"