# harangiert

## Installation
```docker-compose up -d```

```docker run --rm --interactive --tty --volume $PWD/app:/app composer install```

````docker exec -it harangiert-php-fpm php bin/console doctrine:database:create````

```docker exec -it harangiert-php-fpm php bin/console doctrine:migrations:migrate```

### Add new composer packages
```docker run --rm --interactive --tty --volume $PWD/app:/app composer sh```
