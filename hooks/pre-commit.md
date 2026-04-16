# Pre-Commit: Reconcile Intent

Review the conversation history since the last intent sync.
Determine whether the user gave any new direction that changes
project goals, constraints, or constitutes a key decision.

If YES — the user changed direction:

1. Read the current `## Intent` section from `AGENTS.md`.
2. Update `### Current Goals` to reflect the current state of
   what the user wants to build. Remove goals that are no longer
   relevant. Add new goals. Rewrite entirely if needed — this
   is a snapshot, not a log.
3. Update `### Constraints` the same way — snapshot of current
   constraints.
4. Append new entries to `### Key Decisions` with today's date
   in [YYYY-MM-DD] format and a concise one-line summary of
   the decision and its rationale.
5. Update `### Open Questions` — add new questions the user
   raised, remove questions that were resolved (move resolution
   to Key Decisions).
6. Do NOT modify anything outside the `## Intent` section.
7. Do NOT modify anything above or below the Intent section
   boundaries.

If NO — the user didn't change direction:
- Do nothing. Don't touch the file.

Guidelines for writing intent:
- Write in third person ("The user wants..." or use imperative
  "Build a CLI that...").
- Be specific. "Make it fast" → "Target < 200ms cold start for
  single-file conversion."
- Capture rationale in Key Decisions, not just the choice.
  "Chose X" → "Chose X over Y because Z."
- Keep each subsection concise. If Current Goals exceeds 10
  items, the project scope may need clarification with the user.
