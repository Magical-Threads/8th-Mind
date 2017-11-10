#!/bin/bash

# run this only when the mysql container is running and output the contents to file
docker exec -it eighthmind_mysql_1 /usr/local/mysqldata/backupdb.sh
