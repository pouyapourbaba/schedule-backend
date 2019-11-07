FROM node:12.9.0

WORKDIR /schedu-api

COPY package*.json ./

RUN npm install

CMD [ "npm", "start" ]
