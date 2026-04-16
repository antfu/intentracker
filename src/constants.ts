export const INTENT_START_MARKER = '## Intent Tracking'

export const INTENT_RULES = `This section tracks project intent. When the user changes project
direction — new goals, constraints, or decisions about approach —
update the subsections below following these rules:

- **Current Goals** and **Constraints** are snapshots: rewrite to reflect current state
- **Key Decisions** is append-only: add \`[YYYY-MM-DD] description\` entries, never remove
- **Open Questions**: add when raised, remove when resolved (move to Key Decisions)`

export const AGENT_RULES = `This project uses AGENTS.md to track intent (goals, constraints, key decisions).
Read the "## Intent Tracking" section before starting work. When the user changes
project direction, update that section: rewrite Current Goals and Constraints as
snapshots, append Key Decisions with [YYYY-MM-DD] dates, and maintain Open Questions.`

export const AGENT_CONFIG: Record<string, { file: string, label: string }> = {
  cline: { file: '.clinerules', label: '.clinerules' },
  codex: { file: 'AGENTS.md', label: 'AGENTS.md (Codex reads this natively)' },
  copilot: { file: '.github/copilot-instructions.md', label: '.github/copilot-instructions.md' },
  cursor: { file: '.cursorrules', label: '.cursorrules' },
  windsurf: { file: '.windsurfrules', label: '.windsurfrules' },
}
