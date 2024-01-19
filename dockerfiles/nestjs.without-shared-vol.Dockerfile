FROM node:17

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ARG APP_NAME

# CMD npm run nx serve ${APP_NAME}