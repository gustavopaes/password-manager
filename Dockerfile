FROM node:6.9.1

EXPOSE 8443

VOLUME /app
WORKDIR /app

ENTRYPOINT "/app/entrypoint.sh";
