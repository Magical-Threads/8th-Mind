#!/bin/bash
docker-compose stop $1
docker-compose rm -f $1
docker-compose up -d --build $1
