FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install

COPY . .

EXPOSE 3005

ENV PORT=3005

CMD ["npm", "start"]
