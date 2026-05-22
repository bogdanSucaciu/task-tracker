# Task Tracker Phase Plan

## Phase 1: Solution Architecture

Status: Complete

Deliverables:

- Architecture summary.
- Project structure.
- Backend package structure.
- Frontend source structure.
- REST API contracts.
- Implementation roadmap.

Key decisions:

- Use one Spring Boot backend and one React frontend.
- Keep JWT stateless and simple.
- Use assigned users on tasks.
- Exclude task comments from this version.

## Phase 2: Database Design

Status: Complete

Deliverables:

- `users` table with BCrypt password hash storage.
- `tasks` table with required assigned user.
- Task status enum represented in Java and persisted as strings.
- Indexes for assignment, status, assignment plus status, and created timestamp.

## Phase 3: Backend

Status: Complete

Deliverables:

- Spring Boot Maven project.
- Auth registration and login.
- JWT security filter.
- Task CRUD and status filtering.
- User listing for task assignment.
- Error handling and validation.

## Phase 4: Frontend

Status: Complete

Deliverables:

- Vite React TypeScript project.
- Login and register pages.
- Dashboard.
- Task list, create, and edit pages.
- API integration and token handling.

## Phase 5: Testing

Status: Complete

Deliverables:

- Focused backend tests.
- Focused frontend tests.
- Build and test validation notes.

## Phase 6: DevOps

Status: Complete

Deliverables:

- Backend Dockerfile.
- Frontend Dockerfile.
- `docker-compose.yml`.
- `.env.example`.
- README startup instructions.

## Phase 7: Code Review

Status: Complete

Deliverables:

- Strengths.
- Weaknesses.
- Known intentional imperfections.
- Future enhancement opportunities.
