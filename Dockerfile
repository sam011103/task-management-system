FROM php:8.4-fpm-alpine

RUN apk update && apk install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

COPY .env.example .env

RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist

RUN php artisan key:generate

RUN npm install && npm run build

EXPOSE 9000

CMD ["php-fpm"]