# Task Tracker

Task Tracker is a lightweight internal task management application for small engineering teams. It is intentionally small and realistic so it can support demonstrations of delivery automation, AI-assisted review, workflow orchestration, reliability engineering, observability, governance, GitHub automation, and multi-agent workflows.

Task comments are intentionally not implemented in this version.

## Architecture

- `backend/`: Java 21, Spring Boot 3, Maven, Spring Web, Spring Data JPA, Spring Security, JWT, PostgreSQL, Bean Validation.
- `frontend/`: React, Vite, TypeScript, React Router, React Testing Library.
- `docker-compose.yml`: PostgreSQL, backend API, and static frontend container.
- `docs/`: phase notes and review material.
- `AGENTS.md`: future Codex agent conventions.

## Local Development

Backend:

```bash
cd backend
mvn test
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm test
npm run dev
```

The frontend dev server runs at `http://localhost:5173`. The backend runs at `http://localhost:8080`.

## Docker Startup

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:5173`.

## Example Credentials

There are no seeded users. Register a user first:

- Email: `demo@example.com`
- Password: `password123`
- Display name: `Demo User`

The login page pre-fills the email and password for demonstration convenience after you create that user.

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/tasks`
- `GET /api/tasks?status=TODO|IN_PROGRESS|DONE`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

## Validation

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm test
npm run build
```

Compose config:

```bash
docker compose config
```

## Known Intentional Imperfections

- Basic JWT flow with no refresh token.
- `TaskService` has duplicated validation and an in-memory sort TODO.
- Some service methods are larger than ideal for long-term growth.
- Frontend error handling is intentionally simple.
- Test coverage is focused rather than comprehensive.
- No pagination or advanced search.

## Future Enhancements

- Add task comments in a separate workflow.
- Add pagination and assignee/status combined filters.
- Add seeded development data.
- Add structured application logs and metrics.
- Add GitHub Actions for backend, frontend, Docker, and code review checks.
