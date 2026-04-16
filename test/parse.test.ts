import { describe, expect, it } from 'vitest'
import { extractIntentSection, parseIntent } from '../src/parse'

const FULL_INTENT = `## Intent Tracking

This section tracks project intent.

### Current Goals
- Build a CLI that converts markdown to PDF
- Support watching a directory for changes

### Constraints
- No Electron or heavy dependencies
- Must work on Node 18+

### Key Decisions
- [2026-04-14] Chose Puppeteer over WeasyPrint for PDF rendering
- [2026-04-15] Decided against config file — all options via CLI flags

### Open Questions
- Should --watch use chokidar or fs.watch?
- Template caching strategy TBD`

const FILE_WITH_INTENT = `# My Project

${FULL_INTENT}

---

Some other content below.`

describe('parseIntent', () => {
  it('parses a full intent section', () => {
    const result = parseIntent(FULL_INTENT)
    expect(result).not.toBeNull()
    expect(result!.goals).toEqual([
      'Build a CLI that converts markdown to PDF',
      'Support watching a directory for changes',
    ])
    expect(result!.constraints).toEqual([
      'No Electron or heavy dependencies',
      'Must work on Node 18+',
    ])
    expect(result!.decisions).toEqual([
      { date: '2026-04-14', description: 'Chose Puppeteer over WeasyPrint for PDF rendering' },
      { date: '2026-04-15', description: 'Decided against config file — all options via CLI flags' },
    ])
    expect(result!.openQuestions).toEqual([
      'Should --watch use chokidar or fs.watch?',
      'Template caching strategy TBD',
    ])
  })

  it('parses intent embedded in a larger file', () => {
    const result = parseIntent(FILE_WITH_INTENT)
    expect(result).not.toBeNull()
    expect(result!.goals).toHaveLength(2)
    expect(result!.decisions).toHaveLength(2)
  })

  it('returns null when no intent section exists', () => {
    expect(parseIntent('# README\n\nJust a readme.')).toBeNull()
    expect(parseIntent('')).toBeNull()
  })

  it('handles partial sections', () => {
    const partial = `## Intent Tracking

### Current Goals
- One goal only`
    const result = parseIntent(partial)
    expect(result).not.toBeNull()
    expect(result!.goals).toEqual(['One goal only'])
    expect(result!.constraints).toEqual([])
    expect(result!.decisions).toEqual([])
    expect(result!.openQuestions).toEqual([])
  })

  it('handles empty subsections', () => {
    const empty = `## Intent Tracking

### Current Goals

### Constraints

### Key Decisions

### Open Questions`
    const result = parseIntent(empty)
    expect(result).not.toBeNull()
    expect(result!.goals).toEqual([])
    expect(result!.constraints).toEqual([])
    expect(result!.decisions).toEqual([])
    expect(result!.openQuestions).toEqual([])
  })
})

describe('extractIntentSection', () => {
  it('extracts the intent section text', () => {
    const result = extractIntentSection(FILE_WITH_INTENT)
    expect(result).toBe(FULL_INTENT)
  })

  it('returns null when no intent section', () => {
    expect(extractIntentSection('# No intent here')).toBeNull()
  })
})
