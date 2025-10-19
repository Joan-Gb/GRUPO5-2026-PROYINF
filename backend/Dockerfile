FROM node:20-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

# Instalar wait-port globalmente
RUN npm install -g wait-port nodemon

# Comando modificado para esperar a PostgreSQL
CMD ["sh", "-c", "wait-port postgres_db:5432 && nodemon src/server.js"]