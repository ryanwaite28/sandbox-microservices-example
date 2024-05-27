FROM node:17-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

ARG APP_NAME


# CMD npm run nx serve ${APP_NAME}