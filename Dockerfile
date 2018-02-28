FROM node:8

COPY server.js /
COPY package.json /

RUN npm install

COPY . /
