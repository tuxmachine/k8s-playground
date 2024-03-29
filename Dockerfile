FROM node:10-alpine

WORKDIR /app
COPY . .
RUN yarn install

CMD node apiGateway.js