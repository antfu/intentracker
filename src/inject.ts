import { INTENT_START_MARKER } from './constants'
import { createInitialIntent } from './serialize'

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
 * Inject or replace the intent section in file content.
 */
export function injectIntent(existingContent: string, intentMarkdown: string): string {
  const lines = existingContent.split('\n')
  const startIndex = findIntentStart(lines)

  if (startIndex !== -1) {
    // Find end of existing intent section
    let endIndex = lines.length
    for (let i = startIndex + 1; i < lines.length; i++) {
      if ((lines[i].startsWith('## ') && lines[i].trim() !== INTENT_START_MARKER) || lines[i].trim() === '---') {
        endIndex = i
        break
      }
    }
    const before = lines.slice(0, startIndex)
    const after = lines.slice(endIndex)
    return [...before, intentMarkdown, ...after].join('\n')
  }

  // No existing intent section — prepend
  if (existingContent.trim()) {
    return `${intentMarkdown}\n\n---\n\n${existingContent}`
  }
  return `${intentMarkdown}\n`
}

/**
 * Create a new AGENTS.md file with intent section.
 */
export function createAgentsFile(): string {
  return `${createInitialIntent()}\n`
}
