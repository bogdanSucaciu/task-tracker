# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (from `backend/`)

```bash
mvn test                          # run all tests
mvn test -Dtest=TaskServiceTest   # run a single test class
mvn spring-boot:run               # start dev server on :8080
mvn package -DskipTests           # build jar
```

### Frontend (from `frontend/`)

```bash
npm install       # install dependencies
npm test          # run tests (vitest, non-watch)
npm run dev       # start dev server on :5173
npm run build     # tsc + vite build
```

### Docker (from repo root)

```bash
cp .env.example .env
docker compose up --build   # start postgres + backend + frontend
docker compose config       # validate compose config
```

## Architecture

Two independent apps sharing a PostgreSQL database:

- **`backend/`** — Spring Boot 3 / Java 21 REST API on port 8080. Stateless JWT auth (no refresh tokens). Hibernate manages schema via `ddl-auto: update`. Tests use H2 in-memory DB with `MODE=PostgreSQL`.
- **`frontend/`** — React + TypeScript + Vite SPA on port 5173. Dev proxy routes `/api/*` to localhost:8080. Auth token stored in `localStorage` under `taskTrackerToken`.

### Backend package layout

```
auth/        Login, register, JWT issuance
security/    JwtAuthenticationFilter, SecurityConfig, CustomUserDetailsService
task/        Task entity, TaskService, TaskController, DTOs, TaskStatus enum
user/        User entity, UserController, UserRepository
common/      NotFoundException, GlobalExceptionHandler, ApiError
```

All task endpoints require a valid JWT. Only `POST /api/auth/**` is open. CORS allowed origin is driven by `CORS_ALLOWED_ORIGIN` env var (default: `http://localhost:5173`).

### Frontend module layout

```
src/api/         apiRequest wrapper + authApi/taskApi
src/auth/        AuthContext (localStorage persistence), LoginPage, RegisterPage, ProtectedRoute
src/tasks/       DashboardPage, TaskListPage, TaskFormPage, taskTypes
src/components/  Button, Input, Layout
```

`AuthContext` holds `{ token, email, displayName }` and exposes `setSession` / `logout`. `apiRequest` in `src/api/http.ts` injects the Bearer token automatically.

## Key Design Decisions

- **No task comments** — intentionally out of scope for this version.
- **`TaskService.validateRequestAgain()`** — duplicates Bean Validation intentionally (known review material).
- **In-memory sort** in `TaskService.list()` — there is a TODO to move this into the repository query.
- **Task ownership** — tasks have an `assignedUser`; there is no per-user access restriction on reads/writes (any authenticated user can edit any task).
- **No pagination** — `GET /api/tasks` returns all tasks, optionally filtered by `?status=TODO|IN_PROGRESS|DONE`.

## Environment Variables

| Variable | Default | Notes |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/task_tracker` | |
| `SPRING_DATASOURCE_USERNAME` | `task_tracker` | |
| `SPRING_DATASOURCE_PASSWORD` | `task_tracker` | |
| `JWT_SECRET` | `change-me-...` | Must be ≥32 bytes |
| `JWT_EXPIRATION_MINUTES` | `120` | |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:5173` | |
| `VITE_API_BASE_URL` | `""` (uses dev proxy) | Set to `http://localhost:8080` in Docker build |
