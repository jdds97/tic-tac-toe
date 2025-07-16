#!/bin/sh

set -e

export COMPOSE_BAKE=true

docker compose build --pull
docker compose up --remove-orphans --watch
