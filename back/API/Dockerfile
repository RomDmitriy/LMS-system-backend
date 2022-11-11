FROM node:lts-alpine

WORKDIR /backend/api

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]