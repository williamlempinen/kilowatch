#!/usr/bin/env bash
set -euo pipefail
trap 'docker compose -f docker-compose-e2e.yml down -v' EXIT

docker compose -f docker-compose-e2e.yml up --build -d --wait
cd kw-web

# set envs
export E2E_COMPOSE=1
export E2E_BASE_URL=http://localhost:3333

npx playwright test