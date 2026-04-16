import type { Decision, Intent } from './serialize'
import { INTENT_START_MARKER } from './constants'

/**
 * Find the line index of `## Intent Tracking` that is NOT inside an HTML comment.
 */
function findIntentStart(lines: string[]): number {
  let inComment = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!inComment && line.includes('<!--'))
      inComment = true
    if (inComment) {
      if (line.includes('-->'))
        inComment = false
      continue
    }
    if (line.trim() === INTENT_START_MARKER)
      return i
  }
  return -1
}

/**
 * Find the end of the intent section — the next `##` heading or `---` separator.
 */
function findIntentEnd(lines: string[], startIndex: number): number {
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if ((line.startsWith('## ') && line.trim() !== INTENT_START_MARKER) || line.trim() === '---')
      return i
  }
  return lines.length
}

function parseListItems(lines: string[], startIndex: number, endIndex: number): string[] {
  const items: string[] = []
  for (let i = startIndex; i < endIndex; i++) {
    const match = lines[i].match(/^- (.+)$/)
    if (match)
      items.push(match[1].trim())
  }
  return items
}

function findSubsectionRange(
  lines: string[],
  sectionStart: number,
  sectionEnd: number,
  heading: string,
): [number, number] | null {
  for (let i = sectionStart; i < sectionEnd; i++) {
    if (lines[i].trim() === `### ${heading}`) {
      const contentStart = i + 1
      for (let j = contentStart; j < sectionEnd; j++) {
        if (lines[j].startsWith('### '))
          return [contentStart, j]
      }
      return [contentStart, sectionEnd]
    }
  }
  return null
}

function parseDecisions(lines: string[], start: number, end: number): Decision[] {
  const decisions: Decision[] = []
  for (let i = start; i < end; i++) {
    const match = lines[i].match(/^- \[(\d{4}-\d{2}-\d{2})\] (.+)$/)
    if (match) {
      decisions.push({ date: match[1], description: match[2].trim() })
    }
  }
  return decisions
}

export function parseIntent(content: string): Intent | null {
  const lines = content.split('\n')

  const startIndex = findIntentStart(lines)
  if (startIndex === -1)
    return null

  const endIndex = findIntentEnd(lines, startIndex)

  const goalsRange = findSubsectionRange(lines, startIndex, endIndex, 'Current Goals')
  const constraintsRange = findSubsectionRange(lines, startIndex, endIndex, 'Constraints')
  const decisionsRange = findSubsectionRange(lines, startIndex, endIndex, 'Key Decisions')
  const questionsRange = findSubsectionRange(lines, startIndex, endIndex, 'Open Questions')

  return {
    goals: goalsRange ? parseListItems(lines, ...goalsRange) : [],
    constraints: constraintsRange ? parseListItems(lines, ...constraintsRange) : [],
    decisions: decisionsRange ? parseDecisions(lines, ...decisionsRange) : [],
    openQuestions: questionsRange ? parseListItems(lines, ...questionsRange) : [],
  }
}

export function extractIntentSection(content: string): string | null {
  const lines = content.split('\n')
  const startIndex = findIntentStart(lines)
  if (startIndex === -1)
    return null
  const endIndex = findIntentEnd(lines, startIndex)
  let end = endIndex
  while (end > startIndex && lines[end - 1].trim() === '')
    end--
  return lines.slice(startIndex, end).join('\n')
}
