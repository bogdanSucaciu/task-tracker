---
name: code-reviewer
description: Review uncommitted code changes (staged, unstaged, and untracked) against this project's conventions. Delegates security analysis to a dedicated subagent and writes the final review as an HTML report. Use when asked to review local changes, do a code review, or check work before committing.
---

# Code Reviewer

Reviews uncommitted changes in the working tree, delegates the security pass to a dedicated security subagent, and writes the combined findings to a self-contained **HTML report**. Tuned to the Task Tracker conventions in `AGENTS.md` and `CLAUDE.md`.

## Steps

1. Gather the full set of uncommitted changes. Run these together and read everything before judging.

```bash
git status --short
git diff                              # unstaged changes
git diff --cached                     # staged changes
git ls-files --others --exclude-standard   # untracked files (read each with the Read tool)
```

If `git status --short` is empty, report "No uncommitted changes to review" and stop.

2. **Launch the security subagent first**, so it analyzes in parallel while you do the conventions/correctness pass. Use the `Agent` tool with `subagent_type: general-purpose` and the self-contained prompt in *Security Subagent Prompt* below. Do **not** also perform the security checklist yourself — that work belongs to the subagent; you own conventions and correctness.

3. While the subagent runs, review every changed file yourself against the **Conventions & Correctness Checklist**. Read enough surrounding context (not just the diff hunk) to judge correctness — a diff line can look fine but break an invariant in code it doesn't show.

4. Assign each of your findings a severity:
   - **Critical** — must fix before commit. Breaks the build, data loss, or violates a hard project rule.
   - **Warning** — should fix. Likely bug, missing test for new behavior, or convention violation.
   - **Nit** — optional. Style, naming, minor clarity.

5. Distinguish *new* problems from this project's **intentionally preserved imperfections** (see below). Do not raise critical/warning findings for imperfections the project deliberately keeps — mention them only as a nit at most, and note they appear intentional.

6. When the subagent returns, **merge** its security findings with your own, keeping each finding's severity. If a finding overlaps, keep the higher severity and cite the security subagent as the source.

7. Generate the HTML report (see *HTML Report*), write it to `code-review.html` at the repo root with the `Write` tool, and tell the user the path. If nothing rises above nits, say so plainly in the report — do not invent issues.

## Security Subagent Prompt

Pass this verbatim (it is self-contained — the subagent has no access to this conversation):

> You are performing a **security review** of the uncommitted changes in the git repository at the current working directory. This is a Spring Boot (Java 21) + React/TypeScript app called Task Tracker.
>
> 1. Gather the changes yourself: run `git status --short`, `git diff`, `git diff --cached`, and `git ls-files --others --exclude-standard`. Read each untracked/changed file in full for context.
> 2. Analyze **only security concerns**. Check for:
>    - Plaintext or weakly-hashed passwords (must be BCrypt).
>    - Broken authentication / authorization: disabled or bypassed auth on task APIs; access-control or ownership leaks. Note: the documented model is **team-wide access for any authenticated user** — do not flag that baseline, only deviations or new leaks beyond it.
>    - Injection: SQL/JPQL injection, command injection, XSS, path traversal via unsanitized input.
>    - Secrets committed in source or `.env` (only `.env.example` should be tracked); leaked tokens/keys.
>    - JWT handling: weak secret usage, missing signature/expiry verification, statefulness.
>    - Unsafe deserialization, SSRF, insecure CORS widening, missing input validation at boundaries.
> 3. Return ONLY a findings list. For each finding output one line exactly as:
>    `SEVERITY | file:line | issue | suggested fix`
>    where SEVERITY is one of CRITICAL, WARNING, NIT. If there are no security issues, return the single line: `NONE | - | no security issues found | -`.
> Do not fix anything. Do not review style, naming, or non-security correctness. Be specific and cite real file:line locations.

## Conventions & Correctness Checklist (your responsibility)

### Hard project rules — Critical
- Broken build: missing imports, type errors, unresolved symbols, syntax errors.
- New features that contradict a documented design decision — e.g. **task comments are explicitly out of scope** per `AGENTS.md` and `CLAUDE.md`. Flag any comment feature.

### Backend (Java / Spring Boot) — per `AGENTS.md`
- Constructor injection only (no field `@Autowired`).
- Controllers stay thin; business rules live in services.
- Request/response **DTOs**, never entities exposed directly.
- Bean Validation annotations present on request DTOs.
- DB and JWT config come from environment variables.
- Tests added for new auth, task-service, or ownership-sensitive behavior.

### Frontend (React / TypeScript) — per `AGENTS.md`
- Functional components with TypeScript; no class components.
- API calls go through the `apiRequest` fetch wrapper in `src/api/http.ts`.
- Auth state stays simple and persisted via localStorage (`taskTrackerToken`).
- No Redux or heavy component frameworks introduced; styling stays minimal.

### General correctness
- Logic errors, off-by-one, null/undefined handling, unhandled promise rejections.
- Resource leaks, missing error handling at system boundaries.
- Dead code, unused imports/vars left by the change.
- Tests that would fail or that don't actually assert the new behavior.

## Intentionally Preserved Imperfections — do NOT flag as critical/warning
Per `AGENTS.md`, the codebase deliberately keeps minor imperfections for review demos:
- `TaskService.validateRequestAgain()` duplicating Bean Validation.
- In-memory sort in `TaskService.list()` (has a known TODO).
- One or two oversized service methods.
- Small naming inconsistencies and stray TODO comments.
- Mildly inefficient query logic.
- Basic frontend error handling and loading states.
- Focused, non-comprehensive test coverage; no refresh-token flow.

If a change *adds* one of these patterns where it didn't exist before, a nit is appropriate; pre-existing ones are out of scope.

## HTML Report

Write a single self-contained HTML file (inline CSS, no external assets) to `code-review.html` at the repo root. Follow this structure — fill the placeholders, repeat finding rows as needed, and omit a section if it has no findings. Tag each security finding with a `Security` source badge so the delegated analysis is visible.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Code Review Report</title>
<style>
  :root { --crit:#d70015; --warn:#b25000; --nit:#6e6e73; --sec:#5856d6; --bg:#fbfbfd; --card:#fff; --border:#e5e5ea; --text:#1d1d1f; --muted:#6e6e73; }
  * { box-sizing: border-box; }
  body { margin:0; font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; background:var(--bg); color:var(--text); padding:40px 20px; }
  .wrap { max-width:860px; margin:0 auto; }
  h1 { font-size:28px; letter-spacing:-0.02em; margin:0 0 4px; }
  .meta { color:var(--muted); font-size:14px; margin-bottom:28px; }
  .counts { display:flex; gap:10px; margin-bottom:28px; flex-wrap:wrap; }
  .pill { padding:6px 12px; border-radius:999px; font-size:13px; font-weight:600; border:1px solid var(--border); background:var(--card); }
  section { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px 22px; margin-bottom:18px; }
  h2 { font-size:18px; margin:0 0 14px; display:flex; align-items:center; gap:10px; }
  .badge { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; padding:3px 9px; border-radius:6px; color:#fff; }
  .b-crit{background:var(--crit);} .b-warn{background:var(--warn);} .b-nit{background:var(--nit);} .b-sec{background:var(--sec);}
  .finding { padding:12px 0; border-top:1px solid var(--border); }
  .finding:first-of-type { border-top:0; }
  .loc { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; color:var(--sec); }
  .src { font-size:10px; font-weight:700; text-transform:uppercase; padding:2px 6px; border-radius:5px; background:var(--sec); color:#fff; margin-left:8px; }
  .fix { color:var(--muted); font-size:14px; margin-top:4px; }
  .summary { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px 22px; }
  .ok { color:var(--muted); }
</style>
</head>
<body>
<div class="wrap">
  <h1>Code Review Report</h1>
  <div class="meta">{{N}} file(s) changed · generated {{DATE}} · security pass by delegated subagent</div>

  <div class="counts">
    <span class="pill">Critical: {{CRIT_COUNT}}</span>
    <span class="pill">Warnings: {{WARN_COUNT}}</span>
    <span class="pill">Nits: {{NIT_COUNT}}</span>
  </div>

  <section>
    <h2><span class="badge b-crit">Critical</span> {{CRIT_COUNT}}</h2>
    <!-- repeat per finding; add <span class="src">Security</span> after .loc for subagent findings -->
    <div class="finding">
      <span class="loc">path/to/File.java:42</span>
      <div>{{issue, why it matters}}</div>
      <div class="fix">Fix: {{suggested fix}}</div>
    </div>
  </section>

  <section>
    <h2><span class="badge b-warn">Warnings</span> {{WARN_COUNT}}</h2>
    <div class="finding">
      <span class="loc">path/to/file.tsx:88</span><span class="src">Security</span>
      <div>{{issue}}</div>
      <div class="fix">Fix: {{suggested fix}}</div>
    </div>
  </section>

  <section>
    <h2><span class="badge b-nit">Nits</span> {{NIT_COUNT}}</h2>
    <div class="finding">
      <span class="loc">path/to/file.ts:12</span>
      <div>{{issue}}</div>
    </div>
  </section>

  <div class="summary">
    <strong>Summary.</strong> {{1–2 sentences: overall assessment and whether it's safe to commit.}}
  </div>
</div>
</body>
</html>
```

Always cite real `file:line`. Lead with the highest severity. Be specific and actionable — every finding names what to change. After writing the file, give the user a one-line pointer to `code-review.html` and the headline counts.
