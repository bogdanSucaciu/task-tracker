---
description: Stop the Task Tracker application and tear down Docker Compose services. Preserves the postgres volume by default.
---

# Stop Task Tracker

## Steps

1. Stop and remove containers (preserves the `postgres-data` volume so data survives restarts).

```bash
docker compose down
```

2. Confirm all containers are stopped.

```bash
docker compose ps
```

## If you also want to wipe the database

Pass `--volumes` to remove the postgres data volume as well:

```bash
docker compose down --volumes
```

## Expected result

- All three containers (`postgres`, `backend`, `frontend`) are removed
- `docker compose ps` shows no running services
- The `postgres-data` volume is retained (unless `--volumes` was used)
