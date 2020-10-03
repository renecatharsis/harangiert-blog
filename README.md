# Harangiert über Hamburg - a simple blog

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/renecatharsis/harangiert-blog)
[![Build Status](https://travis-ci.org/renecatharsis/harangiert-blog.svg?branch=master)](https://travis-ci.org/renecatharsis/harangiert-blog)

This application is powering https://www.harangiert.de

I decided to make this open source as a very simple example of
a blog running on a proper PHP CMS like Sulu, instead of, you know, *one of the  other systems*.

The installation instructions provided below are only for local development.
It is ***not*** a production setup for reasons like easy database credentials,exposing the database port for external access
or hardcoded configurations.

## Installation environment
You can run this on probably any PHP-compatible OS, depending on which installation 
setting you prefer.

If you don't want to install docker or the required binaries on your local system,
feel free to use the `Vagrantfile` I added to workin within a VM via [Vagrant](https://www.vagrantup.com/).

the VM's default external IP is *192.168.33.10*, but you can change that to whatever you want
in the Vagrantfile's setting called `config.vm.network`.
Docker and docker-compose however are **not** pre-installed.

### Installation for Docker
Documentation on how to install Docker and docker-compose is not included here.

* run `cp .env.dist .env` and adjust settings as you wish
* run `docker run -v app:/app -w /app node:10-alpine yarn install`
* run `docker-compose up -d --build`
* get the PHP-container's ID using `docker ps`
* run `docker exec -it <container-id> composer install`
* run `docker exec -it <container-id> php bin/adminconsole doctrine:database:create --if-not-exists`
* run `docker exec -it <container-id> php bin/adminconsole sulu:build dev`
* run `docker exec -it <container-id> php bin/adminconsole assets:install`
* run `docker exec -it <container-id> php bin/adminconsole sulu:translate:export`

After you've finished the installation, you only need to run `docker-compose up -d`
when booting the project another time.

### Installation on own host
You only need whatever is inside `app` directory!

Documentation on how to install composer, php, yarn or your database is not included here.
Optimizing webserver settings is on you, too.

* run `composer install`
* adjust `app/config/parameters.yml` as you wish
* run `php bin/adminconsole doctrine:database:create --if-not-exists`
* run `bin/adminconsole sulu:build dev`
* run `bin/adminconsole assets:install`
* run `php bin/adminconsole sulu:translate:export`
* run `yarn install`
* run `yarn encore dev --watch` for live frontend updates

### Differences for production
* run `php bin/adminconsole sulu:build prod` instead of `php bin/adminconsole sulu:build dev`
* run `yarn encore production` instead of `yarn encore dev --watch`