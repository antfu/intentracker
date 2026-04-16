# Session Start: Load Intent

Check for `AGENTS.md` in the project root (or `CLAUDE.md` if no `AGENTS.md` exists).

If the file exists and contains an `## Intent` section:
1. Read the full Intent section silently.
2. Treat its contents as authoritative context for this session.
3. When the user's request conflicts with existing code but aligns
   with stated intent, prefer intent.
4. Do NOT summarize the intent to the user unless they ask.
5. Do NOT mention that you loaded intent — just use it naturally.

If the file exists but has no `## Intent` section:
- Do nothing. The user hasn't initialized intent tracking.

If the file does not exist:
- Do nothing. Intent tracking will be initialized on first
  `/intent:init` or `/intent:update`.
