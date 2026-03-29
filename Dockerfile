# prod is default
FROM php:8.5.4-fpm-trixie AS base

RUN apt-get update && \
    apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev libicu-dev libzip-dev unzip

RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) gd && \
    docker-php-ext-install pdo_mysql && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl && \
    docker-php-ext-install zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer --version=2.9.5 && \
    php -r "unlink('composer-setup.php');"

WORKDIR /var/www/html

# don't preinstall anything for local dev
# dev includes xdebug
FROM base AS dev

COPY ./php/php.ini /usr/local/etc/php/conf.d/
COPY ./php/99-xdebug.ini /usr/local/etc/php/conf.d/
RUN pecl install xdebug-3.5.1 && docker-php-ext-enable xdebug

# don't run as root
USER www-data

FROM base AS prod

COPY ./php/php.ini /usr/local/etc/php/conf.d/
COPY ./php/php.prod.ini /usr/local/etc/php/conf.d/
COPY ./app /var/www/html/
RUN composer install --no-scripts --no-dev --optimize-autoloader
RUN chown -R www-data:root /var/www/html/var/cache && chmod -R 774 /var/www/html/var/cache
RUN chown -R www-data:root /var/www/html/var/storage && chmod -R 774 /var/www/html/var/storage

# don't run as root
USER www-data

# keep php-fpm as default command
CMD ["php-fpm"]