FROM node:23-slim

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./


# Copiar el resto del código fuente
COPY . .

# Dar permisos de escritura al usuario node sobre /app
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["bash"]
