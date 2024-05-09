
FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=recipesystem 
ENV MYSQL_USER=recipeking
ENV MYSQL_PASSWORD=123456

COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 3306
