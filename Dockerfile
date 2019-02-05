FROM node:10.15.1-alpine
COPY . /src
WORKDIR /src

RUN apk add --update \
    graphicsmagick \
  && rm -rf /var/cache/apk/*

RUN npm install --production
ENTRYPOINT node docker_entry.js

