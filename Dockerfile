FROM php:8.4-fpm-alpine

# Install required packages
RUN apk add --no-cache \
    bash \
    build-base \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    git \
    curl \
    oniguruma-dev \
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

CMD ["php-fpm"]