FROM php:7.3-fpm-stretch

RUN apt-get update && \
    apt-get install -y nano libfreetype6-dev libjpeg62-turbo-dev apt-transport-https libpng-dev libicu-dev libzip-dev

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install -j$(nproc) gd && \
    docker-php-ext-install pdo_mysql && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl && \
    docker-php-ext-install zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

COPY ./php.ini /usr/local/etc/php/conf.d

WORKDIR /var/www/html