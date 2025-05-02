#!/bin/sh

set -e

docker compose build --pull
docker compose up --remove-orphans --watch
