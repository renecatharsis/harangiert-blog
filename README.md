# harangiert

## Installation
```docker-compose up -d```

```docker run --rm --interactive --tty --volume $PWD/app:/app composer install```

````docker exec -it harangiert-php-fpm php bin/adminconsole doctrine:database:create --if-not-exists````

```docker exec -it harangiert-php-fpm php bin/adminconsole sulu:build dev/prod```

```docker exec -it harangiert-php-fpm php bin/adminconsole assets:install```

```docker exec -it harangiert-php-fpm php bin/adminconsole sulu:translate:export```

```docker exec -it harangiert-encore yarn encore dev --watch/production```

```docker exec -it harangiert-php-fpm php bin/adminconsole doctrine:migrations:migrate```

### Add new composer packages
```docker run --rm --interactive --tty --volume $PWD/app:/app composer sh```
