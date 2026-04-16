export const PREAMBLE = `<!--
AGENT INSTRUCTIONS — INTENT TRACKING

This file tracks project intent. The ## Intent section below is
the source of truth for what this project should achieve and why.

If you are an AI coding agent working on this codebase:

READ the Intent section before starting any task. It describes
what the user is trying to build, their constraints, and key
decisions they've made.

UPDATE it when the user changes project direction — new goals,
new constraints, or decisions about approach. Follow these rules:
- Current Goals and Constraints are SNAPSHOTS: rewrite them to
  reflect current state.
- Key Decisions is APPEND-ONLY: add new entries with [YYYY-MM-DD]
  dates. Never remove old decisions.
- Open Questions: add when raised, remove when resolved.

PREFER intent over existing code when they conflict. If the user
says "this should be public" but the code has auth middleware,
that's a bug in the code, not a change in intent. Only the user
explicitly updating intent can change it.

DO NOT modify anything outside the ## Intent section.
-->`

export const AGENT_RULES = `Before starting any task, read AGENTS.md if it exists. The ## Intent
section describes what this project should accomplish and constraints
to follow. After completing a task where the user changed project
direction, update the Intent section accordingly. Treat intent as
authoritative over implementation. Current Goals and Constraints are
snapshots (rewrite). Key Decisions is append-only with dates.`

export const AGENT_CONFIG: Record<string, { file: string, label: string }> = {
  cursor: { file: '.cursorrules', label: '.cursorrules' },
  windsurf: { file: '.windsurfrules', label: '.windsurfrules' },
  codex: { file: 'AGENTS.md', label: 'AGENTS.md (Codex reads this natively)' },
  copilot: { file: '.github/copilot-instructions.md', label: '.github/copilot-instructions.md' },
  cline: { file: '.clinerules', label: '.clinerules' },
}

export const INTENT_START_MARKER = '## Intent'
export const INTENT_SECTION_SEPARATOR = '---'
