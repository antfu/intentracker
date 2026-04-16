# intentracker

Track project **intent** across AI agent sessions.

## The Problem

When working on a project across multiple agent sessions — whether in Claude Code, Cursor, Copilot, or any other AI coding tool — the agent starts each session with no understanding of *what you're trying to build* or *why you made past decisions*. You end up repeating yourself:

- "Remember, we decided not to use a config file — everything should be CLI flags."
- "The goal is to keep this lightweight, no Electron."
- "We already discussed this — we chose Puppeteer over WeasyPrint for PDF rendering."

Existing memory tools (CLAUDE.md, `.cursorrules`, Memory Bank, etc.) track **operational context** — build commands, code patterns, conventions. None of them systematically track **intent** — what should happen next and why.

| | Operational memory | Intent tracking |
|---|---|---|
| Records | What happened | What should happen |
| Source of truth | Code | User's words |
| Goes stale when | Code changes | User changes their mind |
| Used for | Resuming work | Resolving ambiguity, guiding decisions |

intentracker fills this gap. It maintains a single `## Intent` section in your `AGENTS.md` with four parts:

- **Current Goals** — what you're building (snapshot, rewritten on change)
- **Constraints** — technical boundaries and requirements (snapshot)
- **Key Decisions** — why the project looks the way it does (append-only log with dates)
- **Open Questions** — unresolved decisions (maintained actively)

## Install

```bash
npm i intentracker
```

## Usage

### Quick Start (any agent)

```bash
# Create AGENTS.md with intent tracking
npx intentracker init

# Also inject rules into your agent's config
npx intentracker init --agent cursor
npx intentracker init --agent cursor,windsurf,copilot

# Display current intent
npx intentracker show
```

Supported agents: `cursor`, `windsurf`, `copilot`, `cline`, `codex`

The `--agent` flag injects intent-awareness rules into the agent's config file (e.g., `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`). The `AGENTS.md` file itself is always created — most agents read it natively.

`init` also handles `CLAUDE.md` automatically:
- If `CLAUDE.md` doesn't exist, it creates a symlink pointing to `AGENTS.md` — so Claude Code loads the same intent without duplication.
- If `CLAUDE.md` already exists as a real file, the intent section is appended to both files.

### Without any CLI

You don't need this package at all. Just create an `AGENTS.md` file with this structure:

```markdown
## Intent

### Current Goals
- Build a CLI that converts markdown to PDF with custom templates

### Constraints
- No Electron — keep it lean, pure Node
- Must work on Node 18+

### Key Decisions
- [2026-04-14] Chose Puppeteer over WeasyPrint for PDF rendering
- [2026-04-15] Decided against config file — all options via CLI flags

### Open Questions
- Should --watch use chokidar or fs.watch?
```

The CLI just scaffolds this for you and optionally injects rules into agent config files.

## Claude Code Plugin

For Claude Code users, the plugin provides automatic hooks that load intent on session start and reconcile it before commits — no manual maintenance needed.

```
/plugin install intentracker
```

**Commands:**

- `/intent:show` — Display current intent
- `/intent:update` — Guided intent update
- `/intent:init` — Initialize intent tracking

**Hooks:**

- **Session start** — Loads intent silently, uses it as authoritative context
- **Pre-commit** — Detects direction changes in the conversation and updates the intent section

## Library API

```ts
import { parseIntent, serializeIntent } from 'intentracker'

const content = fs.readFileSync('AGENTS.md', 'utf-8')
const intent = parseIntent(content)

if (intent) {
  console.log(intent.goals)
  console.log(intent.constraints)
  console.log(intent.decisions)
  console.log(intent.openQuestions)
}
```

## How It Works with Other Tools

intentracker complements existing memory systems — it doesn't replace them:

- **CLAUDE.md / Auto Memory** handles operational knowledge (build commands, code patterns)
- **`.cursorrules` / `.windsurfrules`** handles behavioral instructions
- **intentracker** handles directional context (goals, constraints, decisions)

The `AGENTS.md` file format is plain markdown. Any agent that can read a file can follow the instructions in the HTML comment preamble. The Claude Code plugin adds automation on top; the file works without it.

## License

[MIT](./LICENSE.md) License © [Anthony Fu](https://github.com/antfu)
