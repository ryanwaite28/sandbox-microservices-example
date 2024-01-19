FROM node:17-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ARG APP_NAME
ARG SHARED_STORAGE_VOL_PATH

RUN mkdir -p ${SHARED_STORAGE_VOL_PATH}

RUN chmod 755 -R ${SHARED_STORAGE_VOL_PATH}

# CMD npm run nx serve ${APP_NAME}