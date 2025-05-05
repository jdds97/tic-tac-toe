#!/bin/sh

set -e

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "Instalando dependencias..."
  npm ci
fi

echo "Listo. Usa 'docker compose exec -u node app bash' para acceder al contenedor."

tail -f /dev/null