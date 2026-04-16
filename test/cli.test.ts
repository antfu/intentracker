import { lstatSync, mkdirSync, readFileSync, readlinkSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { INTENT_START_MARKER, PREAMBLE } from '../src/constants'
import { createAgentsFile, injectIntent } from '../src/inject'
import { extractIntentSection, parseIntent } from '../src/parse'
import { createInitialIntent } from '../src/serialize'

describe('init logic', () => {
  let dir: string

  beforeEach(() => {
    dir = join(tmpdir(), `intentracker-test-${Date.now()}`)
    mkdirSync(dir, { recursive: true })
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('creates AGENTS.md with preamble and intent section', () => {
    const content = createAgentsFile()
    const path = join(dir, 'AGENTS.md')
    writeFileSync(path, content)

    const written = readFileSync(path, 'utf-8')
    expect(written).toContain(PREAMBLE)
    expect(written).toContain(INTENT_START_MARKER)
    expect(written).toContain('### Current Goals')
  })

  it('is idempotent — does not duplicate intent section', () => {
    const content = createAgentsFile()
    expect(content.includes(INTENT_START_MARKER)).toBe(true)
    const updated = injectIntent(content, createInitialIntent())
    const intent = parseIntent(updated)
    expect(intent).not.toBeNull()
    const extracted = extractIntentSection(updated)
    expect(extracted).toContain('### Current Goals')
  })

  it('injects intent into existing file without intent', () => {
    const existing = '# My Project\n\nSome documentation here.\n'
    const updated = injectIntent(existing, createInitialIntent())
    expect(updated).toContain(PREAMBLE)
    expect(updated).toContain(INTENT_START_MARKER)
    expect(updated).toContain('# My Project')
  })

  it('replaces existing intent section', () => {
    const original = `${PREAMBLE}\n\n## Intent\n\n### Current Goals\n- Old goal\n\n### Constraints\n\n### Key Decisions\n\n### Open Questions\n`
    const newIntent = '## Intent\n\n### Current Goals\n- New goal\n\n### Constraints\n\n### Key Decisions\n\n### Open Questions'
    const updated = injectIntent(original, newIntent)
    expect(updated).toContain('- New goal')
    expect(updated).not.toContain('- Old goal')
    const intent = parseIntent(updated)
    expect(intent).not.toBeNull()
    expect(intent!.goals).toEqual(['New goal'])
  })
})

describe('claude.md symlink behavior', () => {
  let dir: string

  beforeEach(() => {
    dir = join(tmpdir(), `intentracker-symlink-${Date.now()}`)
    mkdirSync(dir, { recursive: true })
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('intent written to AGENTS.md is readable through CLAUDE.md symlink', async () => {
    const { symlinkSync } = await import('node:fs')
    const agentsPath = join(dir, 'AGENTS.md')
    const claudePath = join(dir, 'CLAUDE.md')

    writeFileSync(agentsPath, createAgentsFile())
    symlinkSync('AGENTS.md', claudePath)

    // Reading through the symlink should give the same content
    const agentsContent = readFileSync(agentsPath, 'utf-8')
    const claudeContent = readFileSync(claudePath, 'utf-8')
    expect(claudeContent).toBe(agentsContent)

    // Verify it's a symlink
    expect(lstatSync(claudePath).isSymbolicLink()).toBe(true)
    expect(readlinkSync(claudePath)).toBe('AGENTS.md')
  })

  it('injects intent into existing CLAUDE.md when it is a real file', () => {
    const agentsPath = join(dir, 'AGENTS.md')
    const claudePath = join(dir, 'CLAUDE.md')

    // Create AGENTS.md with intent
    writeFileSync(agentsPath, createAgentsFile())

    // Create a real CLAUDE.md with existing content
    writeFileSync(claudePath, '# Claude Config\n\nSome existing rules.\n')

    // Simulate what init does: inject intent from AGENTS.md into CLAUDE.md
    const agentsContent = readFileSync(agentsPath, 'utf-8')
    const intentSection = extractIntentSection(agentsContent)
    expect(intentSection).not.toBeNull()

    const claudeContent = readFileSync(claudePath, 'utf-8')
    const updated = injectIntent(claudeContent, intentSection!)
    writeFileSync(claudePath, updated)

    // Both files should have intent
    expect(parseIntent(readFileSync(agentsPath, 'utf-8'))).not.toBeNull()
    expect(parseIntent(readFileSync(claudePath, 'utf-8'))).not.toBeNull()
    // CLAUDE.md should preserve existing content
    expect(readFileSync(claudePath, 'utf-8')).toContain('# Claude Config')
  })
})

describe('show logic', () => {
  it('extracts intent section from file content', () => {
    const content = createAgentsFile()
    const intent = extractIntentSection(content)
    expect(intent).not.toBeNull()
    expect(intent).toContain('## Intent')
  })

  it('returns null for file without intent', () => {
    expect(extractIntentSection('# Just a readme')).toBeNull()
  })
})
