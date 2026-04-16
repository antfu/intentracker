import { INTENT_RULES, INTENT_START_MARKER } from './constants'

export interface Decision {
  date: string
  description: string
}

export interface Intent {
  goals: string[]
  constraints: string[]
  decisions: Decision[]
  openQuestions: string[]
}

export function serializeIntent(intent: Intent): string {
  const lines: string[] = [INTENT_START_MARKER, '', INTENT_RULES, '']

  lines.push('### Current Goals')
  if (intent.goals.length > 0) {
    for (const goal of intent.goals)
      lines.push(`- ${goal}`)
  }
  lines.push('')

  lines.push('### Constraints')
  if (intent.constraints.length > 0) {
    for (const constraint of intent.constraints)
      lines.push(`- ${constraint}`)
  }
  lines.push('')

  lines.push('### Key Decisions')
  if (intent.decisions.length > 0) {
    for (const decision of intent.decisions)
      lines.push(`- [${decision.date}] ${decision.description}`)
  }
  lines.push('')

  lines.push('### Open Questions')
  if (intent.openQuestions.length > 0) {
    for (const question of intent.openQuestions)
      lines.push(`- ${question}`)
  }

  return lines.join('\n')
}

export function createInitialIntent(): string {
  return serializeIntent({
    goals: [],
    constraints: [],
    decisions: [],
    openQuestions: [],
  })
}
