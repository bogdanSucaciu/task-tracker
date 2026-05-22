# Task Tracker Agent Guide

## Project Conventions

Task Tracker is a small internal engineering task management app. Keep the codebase direct, readable, and suitable for demonstrations of delivery automation, AI-assisted review, orchestration, reliability, observability, governance, GitHub automation, and multi-agent workflows.

Do not implement task comments in this version.

## Architecture Rules

- Backend lives in `backend/` and uses Java 21, Spring Boot 3, Maven, Spring Web, Spring Data JPA, Spring Security, JWT authentication, PostgreSQL, and Bean Validation.
- Frontend lives in `frontend/` and uses React, Vite, and TypeScript.
- Infrastructure files live at the repository root unless they are specific to one app.
- Documentation lives in `docs/`.
- Keep the application as one backend service and one frontend app. Do not add microservices or Kubernetes.
- Prefer simple package and component boundaries over generic abstraction layers.

## Backend Guidelines

- Use constructor injection.
- Keep controllers thin and put business rules in services.
- Use request and response DTOs instead of exposing entities directly.
- Hash passwords with BCrypt.
- Keep JWT authentication stateless.
- Enforce authentication for task APIs.
- Use Bean Validation on request DTOs.
- Use environment variables for database and JWT configuration.

## Frontend Guidelines

- Use functional React components and TypeScript.
- Use a small fetch wrapper for API calls.
- Keep auth state simple and persistent through local storage.
- Keep styling minimal but usable.
- Do not add Redux or a large component framework.

## Testing Strategy

- Add focused backend tests for authentication, task service behavior, and ownership-sensitive flows.
- Add focused frontend tests for login and task rendering behavior.
- Do not chase perfect coverage; leave realistic testing gaps for future review demonstrations.
- Run backend and frontend validation after major changes.

## Intentional Review Material

The codebase may intentionally retain minor imperfections:

- Duplicated validation in a couple places.
- One or two oversized service methods.
- Small naming inconsistencies.
- TODO comments.
- Mildly inefficient query logic.
- Basic frontend error handling.

Do not introduce critical issues such as plaintext passwords, task ownership leaks, broken builds, or disabled authentication.

## Agent Responsibilities

- Solution Architect Agent: architecture, project structure, API contracts, and roadmap.
- Database Engineer Agent: PostgreSQL schema, entity relationships, indexes, and persistence choices.
- Backend Engineer Agent: Spring Boot implementation, auth, task APIs, validation, and backend tests.
- Frontend Engineer Agent: React implementation, routing, auth flow, and task UI.
- Testing Agent: focused automated tests and validation notes.
- DevOps Agent: Dockerfiles, docker-compose, environment examples, and startup docs.
- Code Review Agent: review summary, strengths, weaknesses, and future demo opportunities.

## Workflow Expectations

- Separate planning from implementation.
- Show handoffs between agents.
- Build incrementally.
- Validate after major phases.
- Preserve realistic imperfections unless the task is specifically to fix them.
- Keep outputs deterministic and concise.
