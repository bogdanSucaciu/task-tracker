# PRD: Task Priority

**Status:** Draft · **Author:** Demo · **Version:** 1.0

## 1. Summary

Add a **priority** to every task so users can tell urgent work apart from routine work. Priority is one of `LOW`, `MEDIUM`, `HIGH`, defaults to `MEDIUM`, and is shown as a colored badge in the task list. Users can filter the list by priority and sort by priority.

This mirrors the existing `status` field (`TODO`/`IN_PROGRESS`/`DONE`) in shape and treatment, so it should slot into the current patterns with no new architecture.

## 2. Problem & Goal

Today all tasks look equally important — the only axes are status and assignee. A user with 30 `TODO` tasks has no way to surface what matters first.

**Goal:** Let a user mark and find high-priority work in under two clicks.

## 3. Requirements

### 3.1 Data model
- New enum `TaskPriority { LOW, MEDIUM, HIGH }`.
- `Task` gains a non-null `priority` column, default `MEDIUM`.
- Existing tasks (created before this change) must default to `MEDIUM` — no nulls.

### 3.2 API
- `priority` is accepted on **create** and **update** task requests, and returned on every task response.
- If `priority` is omitted on create, the server stores `MEDIUM`.
- Invalid values (e.g. `"URGENT"`) return `400` with a validation error, consistent with how an invalid `status` is handled today.
- `GET /api/tasks` gains an optional `?priority=LOW|MEDIUM|HIGH` filter that composes with the existing `?status=` filter.
  - Example: `GET /api/tasks?status=TODO&priority=HIGH` returns only high-priority TODO tasks.
- `GET /api/tasks` gains an optional `?sort=priority` that orders results **HIGH → MEDIUM → LOW** (ties keep the current ordering). Default ordering is unchanged when `sort` is absent.

#### Concrete request/response examples

Create with explicit priority:
```http
POST /api/tasks
{
  "title": "Fix login 500 error",
  "description": "Auth endpoint throws on empty body",
  "status": "TODO",
  "priority": "HIGH",
  "assignedUserId": 4
}
```
Response `201`:
```json
{
  "id": 87,
  "title": "Fix login 500 error",
  "status": "TODO",
  "priority": "HIGH",
  "assignedUser": { "id": 4, "displayName": "Bogdan" },
  "createdAt": "2026-06-01T10:15:00Z"
}
```

Create with priority omitted → defaults to `MEDIUM`:
```http
POST /api/tasks
{ "title": "Update README", "status": "TODO", "assignedUserId": 4 }
```
Response includes `"priority": "MEDIUM"`.

### 3.3 Frontend
- The task list shows a priority **badge** next to (or near) the existing status badge:
  - `HIGH` → red
  - `MEDIUM` → amber/yellow
  - `LOW` → gray
- The task create/edit form has a **Priority** dropdown (`Low` / `Medium` / `High`), defaulting to `Medium`.
- The list page has a **priority filter** control alongside the existing status filter. Selecting `High` calls `GET /api/tasks?priority=HIGH`.
- A "Sort by priority" toggle requests `?sort=priority` and renders the list HIGH → LOW.

## 4. Acceptance Criteria

1. Creating a task without `priority` stores and returns `MEDIUM`.
2. Creating a task with `"priority": "HIGH"` stores and returns `HIGH`.
3. Sending `"priority": "URGENT"` returns `400`, not `500`.
4. `GET /api/tasks?priority=HIGH` returns only `HIGH` tasks; combining with `?status=TODO` filters by both.
5. `GET /api/tasks?sort=priority` returns tasks ordered HIGH → MEDIUM → LOW.
6. The list badge color matches the priority (HIGH red, MEDIUM amber, LOW gray).
7. The edit form pre-selects the task's current priority and persists changes.
8. Backend tests cover: default-on-create, round-trip create/update, invalid-value rejection, and the priority filter.

## 5. Out of Scope

- Custom or numeric priorities beyond the three levels.
- Per-user default priority preferences.
- Automatic priority escalation based on due dates (no due-date field exists).
- Reordering tasks by drag-and-drop.

## 6. Notes for Implementation

- Model `TaskPriority` exactly like the existing `TaskStatus` enum (`@Enumerated(EnumType.STRING)`, `length = 20`, validated on the request DTO).
- Reuse the existing in-list sort path in `TaskService.list()` for `?sort=priority` rather than adding a new query path.
- Hibernate `ddl-auto: update` will add the column; ensure the default backfills existing rows to `MEDIUM`.
