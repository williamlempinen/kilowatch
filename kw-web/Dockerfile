FROM node:24

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
COPY ./src src

RUN npm ci

EXPOSE 3000

CMD [ "npm", "run", "build" ]
