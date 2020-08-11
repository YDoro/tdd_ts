FROM node:12
WORKDIR /var/www/clean-node-api
COPY ./package.json .
RUN npm install --only=prod