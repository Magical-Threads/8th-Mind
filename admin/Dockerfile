FROM php:7.1-apache

# enable mod-rewrite
RUN a2enmod rewrite

# enable additional php libraries
RUN docker-php-ext-install mysqli pdo pdo_mysql

# create storage folder and make it writeable
RUN mkdir -p /var/www/html/storage && chmod a+rwx -R /var/www/html/storage
