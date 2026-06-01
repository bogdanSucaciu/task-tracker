---
description: Push the current branch to origin and open a GitHub PR when on a feature branch. Sets upstream if needed; on main it pushes only with no PR. Use when asked to push changes or open a PR.
---

# Push Changes

Push the current branch to `origin`. If on a feature branch, also open a GitHub PR. On `main`/`master`, push only — no PR.

## Steps

1. Determine the current branch and whether it already has an upstream.

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null && HAS_UPSTREAM=1 || HAS_UPSTREAM=0
echo "branch=$BRANCH upstream=$HAS_UPSTREAM"
```

2. Push. Set the upstream with `-u` on the first push of a new branch; otherwise a plain push.

```bash
if [ "$HAS_UPSTREAM" = "1" ]; then
  git push
else
  git push -u origin "$BRANCH"
fi
```

3. If the branch is `main` or `master`, stop here — push only, no PR. Report the pushed branch.

4. Otherwise, prepare to open a PR. Confirm `gh` is installed and authenticated; if not, report what's missing instead of failing silently.

```bash
command -v gh >/dev/null || { echo "gh CLI not installed"; exit 1; }
gh auth status || { echo "gh not authenticated — run: gh auth login"; exit 1; }
```

5. Determine the repository's default (base) branch, then review the commits going into the PR to write its title and body. Derive the base from the remote rather than assuming `main`, so it works on `master`-based repos too.

```bash
BASE=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@')
BASE=${BASE:-main}
git fetch origin "$BASE" --quiet 2>/dev/null
git log "origin/$BASE..HEAD" --oneline
```

6. Create the PR against the derived base. Title summarizes the branch's intent; body has a Summary and Test plan, ending with the Claude footer.

```bash
gh pr create --base "$BASE" --title "<concise title>" --body "$(cat <<'EOF'
## Summary
- <what changed and why>

## Test plan
- <how it was/should be verified>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

7. Report the pushed branch and the PR URL returned by `gh pr create`.

## Expected result

- Current branch pushed to `origin`, with upstream set if it was new.
- On a feature branch: a GitHub PR is opened and its URL is reported.
- On `main`/`master`: pushed only, with a note that no PR was opened.
