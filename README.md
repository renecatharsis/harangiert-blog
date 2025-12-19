# Harangiert über Hamburg - a simple blog

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/renecatharsis/harangiert-blog)
[![Build Status](https://app.travis-ci.com/renecatharsis/harangiert-blog.svg?branch=main)](https://app.travis-ci.com/github/renecatharsis/harangiert-blog)

This application is powering https://www.harangiert.de

I decided to make this open source as a very simple example of
a blog running on a proper PHP CMS like Sulu, instead of, you know, *one of the  other systems*.

The installation instructions provided below are only for local development.
It is ***not*** a production setup for reasons like easy database credentials,exposing the database port for external access
or hardcoded configurations.

## Installation environment
You can run this on probably any PHP-compatible OS, depending on which installation 
setting you prefer.

### Installation for Docker
Documentation on how to install Docker and docker-compose is not included here.

* run `cp .env.dist .env` and adjust settings as you wish
* run `docker-compose up -d --build`
* run `docker exec -it harangiert_php composer install`
* run `docker exec -it harangiert_php php bin/adminconsole doctrine:database:create --if-not-exists`
* run `docker exec -it harangiert_php php bin/adminconsole sulu:build dev`
* run `docker exec -it harangiert_php php bin/adminconsole assets:install`
* run `docker run --rm -v ./app/:/app -w /app/assets/admin node:20-alpine npm install`
* run `docker run --rm -v ./app/:/app -w /app/assets/website node:20-alpine npm install`
* watch frontend changes
  * run `docker run --rm -v ./app/:/app -w /app/assets/admin node:20-alpine npm run watch`
  * run `docker run --rm -v ./app/:/app -w /app/assets/website node:20-alpine npm run watch`

After you've finished the installation, you only need to run `docker-compose up -d`
when booting the project another time.

### Differences for production builds
Production build doesn't boot any database.
Add one if you wish to or connect to a local or external database.

* run `cp .env.dist .env` and adjust settings as you wish
  * make sure to set `COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml`
* run `./build.sh`
* run `docker compose up -d --build` 
