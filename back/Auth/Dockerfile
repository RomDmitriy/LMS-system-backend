FROM node:lts-alpine

WORKDIR /backend/auth

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]