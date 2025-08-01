# prod is default
FROM php:8.4.10-fpm-bookworm AS prod

RUN apt-get update && \
    apt-get install -y nano libfreetype6-dev libjpeg62-turbo-dev apt-transport-https libpng-dev libwebp-dev libicu-dev libzip-dev unzip

RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) gd && \
    docker-php-ext-install pdo_mysql && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl && \
    docker-php-ext-install zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer --2 && \
    php -r "unlink('composer-setup.php');"

COPY ./php.ini /usr/local/etc/php/conf.d

WORKDIR /var/www/html

# dev includes xdebug
FROM prod AS dev

COPY ./xdebug.ini /usr/local/etc/php/conf.d
RUN pecl install xdebug && docker-php-ext-enable xdebug
