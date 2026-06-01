---
description: End-to-end PRD delivery — pull a Product Requirements Document from Google Drive, implement the changes, review them, then commit & push via the project Git workflow. Use when asked to implement a PRD or run the PRD workflow.
---

# PRD Implementation

Take a PRD from Google Drive through implementation to an opened PR. Each phase gates the next: do not implement until the PRD is understood, do not commit until the review is clean.

The PRD to use is whatever the user named (a Drive document title or link). If they didn't name one, ask which PRD before starting.

## Step 1 — Pull the PRD from Google Drive

1. The Google Drive MCP server requires OAuth. Its real tools (search/fetch) only appear **after** authentication. Check whether they're available; if only `mcp__claude_ai_Google_Drive__authenticate` is present, start the flow:
   - Call `mcp__claude_ai_Google_Drive__authenticate`, share the returned authorization URL with the user, and wait.
   - When the user returns the `http://localhost:.../callback?...` URL, pass it to `mcp__claude_ai_Google_Drive__complete_authentication`.
2. Once authenticated, use the Drive search tool to locate the PRD by the title/link the user gave, then fetch its full contents.
3. Read the PRD end to end and extract a concrete requirements list: what to build/change, acceptance criteria, and anything explicitly out of scope. Summarize it back to the user in a few bullets and confirm your understanding before writing code. If the PRD is ambiguous or conflicts with a documented design decision in `CLAUDE.md`/`AGENTS.md`, surface that now rather than guessing.

## Step 2 — Implement the required changes

1. Plan the change against the codebase (backend `backend/`, frontend `frontend/`) following the conventions in `CLAUDE.md` and `AGENTS.md`.
2. Implement the requirements from Step 1. Add or update tests for new behavior. Keep changes scoped to the PRD — do not fold in unrelated refactors.
3. Run the relevant test suites and make them pass before moving on:
   - Backend: `cd backend && mvn test`
   - Frontend: `cd frontend && npm test`

## Step 3 — Code review

Run the project's **`code-reviewer`** skill on the uncommitted changes. Address every Critical and Warning finding it reports (re-run tests after fixes). Do not proceed to commit while Critical findings remain.

## Step 4 — Commit & push

Use the project's Git workflow skills, in order:
1. **`commit-changes`** — branches off `main`/`master`, stages the work, and commits with a Conventional Commits message derived from the diff.
2. **`push-changes`** — pushes the branch and opens a GitHub PR (base branch derived from the remote default).

Report the branch name, commit, and PR URL.

## Expected result

- PRD requirements pulled from Google Drive, summarized, and confirmed.
- Changes implemented with passing tests.
- Code review run and Critical/Warning findings resolved.
- Work committed, pushed, and opened as a PR.
