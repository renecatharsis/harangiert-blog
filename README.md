# harangiert

## Installation using docker
``docker run -v app:/app -w /app node:10-alpine yarn install``

``docker-compose up -d``

``docker exec -it harangiert-php-fpm composer install``

``docker exec -it harangiert-php-fpm php bin/adminconsole doctrine:database:create --if-not-exists``

``docker exec -it harangiert-php-fpm php bin/adminconsole sulu:build dev/prod``

``docker exec -it harangiert-php-fpm php bin/adminconsole assets:install``

``docker exec -it harangiert-php-fpm php bin/adminconsole sulu:translate:export``

## Installation on classic host
You only need whatever is inside ``app`` directory!

``composer install``

``php bin/adminconsole doctrine:database:create --if-not-exists``

``bin/adminconsole sulu:build prod``

``bin/adminconsole assets:install``

``php bin/adminconsole sulu:translate:export``

``yarn install``

``yarn encore production ``


## local development
```docker exec -it harangiert-encore yarn encore dev --watch/production```
