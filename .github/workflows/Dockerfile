FROM php:8.4-fpm

# Install system dependencies
RUN apk add --no-cache git unzip libzip-dev nodejs npm \
    && docker-php-ext-install zip pdo pdo_mysql
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Install Node deps & build assets
RUN npm ci && npm run build

RUN chown -R www-data:www-data /var/www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]





