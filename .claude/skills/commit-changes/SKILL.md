---
description: Stage all changes and commit using Conventional Commits. Branches off first if on main, then stages everything, derives a type(scope) message from the diff, and commits with the Claude co-author trailer. Use when asked to commit changes.
---

# Commit Changes

Stage all changes and create a Conventional Commits commit. No pre-commit tests, build, or confirmation — this is the fast path.

## Steps

1. Check there is something to commit. If the working tree is clean, stop and report it.

```bash
git status --porcelain
```

2. If currently on `main` or `master`, create a feature branch before committing. Pick a short, descriptive kebab-case name with a Conventional Commits prefix based on the change (e.g. `feat/task-comments`, `fix/auth-token`). Otherwise stay on the current branch.

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  git checkout -b <type>/<short-description>   # type matches the commit, e.g. feat/task-comments, fix/auth-token
fi
```

3. Stage all modified and untracked files.

```bash
git add -A
```

4. Inspect the staged diff to write the commit message.

```bash
git diff --cached --stat
git diff --cached
```

5. Compose a Conventional Commits message:
   - **type**: one of `feat`, `fix`, `docs`, `refactor`, `test`, `chore` (pick from the diff).
   - **scope**: the affected area, e.g. `task`, `auth`, `user`, `security`, `frontend`, `docker` — omit if it spans many.
   - **subject**: imperative, lower-case, no trailing period.
   - Add a body only when the change is non-trivial and the "why" isn't obvious.

6. Commit with the co-author trailer (use a HEREDOC so the body and trailer format correctly).

```bash
git commit -m "$(cat <<'EOF'
type(scope): short imperative summary

Optional body explaining the why, when non-trivial.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

7. Confirm the result.

```bash
git log -1 --stat
```

## Expected result

- All changes committed on a feature branch (never directly on `main`/`master`).
- Commit message follows Conventional Commits and ends with the Claude co-author trailer.
- If the tree was clean, nothing is committed and that is reported.
