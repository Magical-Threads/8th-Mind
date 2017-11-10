# 8th Mind

This README outlines the details of collaborating on the 8th Mind web application.  It runs using 3 sub-applications
in parallel:

* Admin - content management system powered by a CodeIgniter backend with a MySQL database
* API - provides REST API access to the MySQL data using ExpressJS
* Frontend - presentation and UI control layer using Ember framework

## Prerequisites

You will need the following things properly installed

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [Docker](https://www.docker.com/)

In production:

* [nginx](https://nginx.org)

## Installation on a Production Server

Deployment servers must have their public keys added to this repository in order to have read access (see Settings).
The default configuration assumes deployment on a Linux server with the above packages installed where users can
access the sub-applications as follows:

* Main site: http://8thmind.com
* Back-end Content Management: http://admin.8thmind.com
* Content API: http://api.8thmind.com

* `git clone <repository-url>` this repository

### Database and API

* copy web.env.production or equivalent to web.env to match your DNS settings
* if a more up-to-date mysqldump is available, replace the one in ./docker-entrypoint-initdb.d/content_portal.sql
* run `docker-compose up -d` to start the containers in detached mode

### Front-end

* `cd frontend`
* `npm install`
* `bower install`
* `ember build --environment production`
* configure nginx to serve ./frontend/dist/ (see ./nginx/nginx.conf for sample configuration)
* configure nginx to reverse proxy route admin and API (see ./nginx/virtual.conf for sample configuration)

## Installation in a Development Environment

The default configuration assumes that you are running the latest version of the Docker client on your computer.  The
applications will be accessible as follows:

* Main site: http://localhost:4200
* Back-end Content Management: http://localhost:8001
* Content API: http://localhost:3000

### Database and API

* copy web.env.dev or equivalent to web.env
* if a more up-to-date mysqldump is available, replace the one in ./docker-entrypoint-initdb.d/content_portal.sql
* run `docker-compose up -d` to start the containers in detached mode

### Front-end

* `cd frontend`
* `npm install`
* `bower install`
* `ember serve`

## Pushing Changes

When changes have been made to the codebase, this process will allow them to be reflected on a production server:

### Docker containers (mysql, admin, server)

IMPORTANT: if the mysql container is rebuilt, the database will be repopulated with the data contained in
./docker-entrypoint-initdb.d/content_portal.sql -- if this is not the intended effect, be sure to take precaution
to either update the sql with a current mysqldump.  In most cases, it is not necessary to restart or rebuild the
mysql container.

For the below commands, replace [container] with the container label (either [mysql] for database, [admin] for
back-end, or [server] for API) as appropriate:

* `git pull`
* `docker-compose stop [container]`
* `docker-compose rm -f [container]`
* `docker-compose up -d`

### Front-end

* `git pull`
* `cd frontend`
* `npm install`
* `bower install`
* `ember build --environment production`

