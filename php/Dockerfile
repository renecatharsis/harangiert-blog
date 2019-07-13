FROM php:7.3-fpm

RUN apt-get update && \
    apt-get install -y nano libfreetype6-dev libjpeg62-turbo-dev apt-transport-https libpng-dev libicu-dev

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install -j$(nproc) gd && \
    docker-php-ext-install pdo_mysql && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl

COPY ./php.ini /usr/local/etc/php/conf.d