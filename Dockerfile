FROM node:23-slim

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./
RUN npm ci


EXPOSE 3000
CMD ["npm", "run", "dev"]