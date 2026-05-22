---
description: Start the Task Tracker application via Docker Compose (postgres + backend + frontend). Waits for healthy services and smoke-tests both endpoints.
---

# Start Task Tracker

## Steps

1. Ensure Docker Desktop is running. If `docker info` fails, launch it and wait.

```bash
docker info &>/dev/null || (open -a Docker && until docker info &>/dev/null; do sleep 2; done)
```

2. Ensure `.env` exists (copy from `.env.example` if missing).

```bash
[ -f .env ] || cp .env.example .env
```

3. Build and start all services in the background.

```bash
docker compose up --build -d
```

4. Wait for the backend to be reachable (it starts after postgres health check passes).

```bash
until curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/tasks | grep -qE "^(200|403|401)$"; do sleep 3; done
```

5. Smoke-test both services and report status.

```bash
BACKEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/tasks)
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
echo "Backend: $BACKEND (expect 403 — auth required)"
echo "Frontend: $FRONTEND (expect 200)"
```

## Expected result

- Backend responds `403` at `http://localhost:8080` (correct — auth is required)
- Frontend responds `200` at `http://localhost:5173`
- App is usable at **http://localhost:5173** — register a user first (no seeded users)
