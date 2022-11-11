FROM node:lts-alpine

WORKDIR /backend/uploader

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]