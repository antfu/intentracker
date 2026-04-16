import type { Intent } from '../src/types'
import { describe, expect, it } from 'vitest'
import { parseIntent } from '../src/parse'
import { createInitialIntent, serializeIntent } from '../src/serialize'

describe('serializeIntent', () => {
  it('serializes a full intent', () => {
    const intent: Intent = {
      goals: ['Build a CLI tool', 'Support plugins'],
      constraints: ['No external deps', 'Node 18+'],
      decisions: [
        { date: '2026-04-14', description: 'Chose TypeScript' },
      ],
      openQuestions: ['Which test runner?'],
    }
    const result = serializeIntent(intent)
    expect(result).toContain('## Intent')
    expect(result).toContain('- Build a CLI tool')
    expect(result).toContain('- Support plugins')
    expect(result).toContain('- No external deps')
    expect(result).toContain('- [2026-04-14] Chose TypeScript')
    expect(result).toContain('- Which test runner?')
  })

  it('serializes empty intent', () => {
    const result = createInitialIntent()
    expect(result).toContain('## Intent')
    expect(result).toContain('### Current Goals')
    expect(result).toContain('### Constraints')
    expect(result).toContain('### Key Decisions')
    expect(result).toContain('### Open Questions')
  })

  it('round-trips through parse and serialize', () => {
    const intent: Intent = {
      goals: ['Goal A', 'Goal B'],
      constraints: ['Constraint X'],
      decisions: [
        { date: '2026-01-01', description: 'Decision 1' },
        { date: '2026-02-15', description: 'Decision 2' },
      ],
      openQuestions: ['Question?'],
    }
    const serialized = serializeIntent(intent)
    const parsed = parseIntent(serialized)
    expect(parsed).toEqual(intent)
  })
})
