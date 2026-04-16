#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { AGENT_CONFIG, AGENT_RULES, INTENT_START_MARKER } from './constants'
import { createAgentsFile, injectIntent } from './inject'
import { extractIntentSection } from './parse'

const args = process.argv.slice(2)
const command = args[0]

function getAgents(): string[] {
  const idx = args.indexOf('--agent')
  if (idx === -1)
    return []
  const value = args[idx + 1]
  if (!value)
    return []
  return value.split(',').map(s => s.trim().toLowerCase())
}

function injectAgentRules(agent: string): void {
  const config = AGENT_CONFIG[agent]
  if (!config) {
    console.log(`Unknown agent: ${agent}. Supported: ${Object.keys(AGENT_CONFIG).join(', ')}`)
    return
  }

  if (agent === 'codex') {
    console.log(`Codex reads AGENTS.md natively — no extra config needed.`)
    return
  }

  const rulesPath = resolve(process.cwd(), config.file)
  const dir = dirname(rulesPath)
  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true })

  const existing = existsSync(rulesPath) ? readFileSync(rulesPath, 'utf-8') : ''
  if (existing.includes('Intent Tracking')) {
    console.log(`Intent rules already present in ${config.label}.`)
    return
  }

  const newContent = existing.trim()
    ? `${existing.trim()}\n\n${AGENT_RULES}\n`
    : `${AGENT_RULES}\n`
  writeFileSync(rulesPath, newContent)
  console.log(`Added intent rules to ${config.label}.`)
}

function initAgentsMd(agentsPath: string): void {
  if (existsSync(agentsPath)) {
    const content = readFileSync(agentsPath, 'utf-8')
    if (content.includes(INTENT_START_MARKER)) {
      console.log(`Intent tracking already initialized in AGENTS.md.`)
      return
    }
    const updated = injectIntent(content, extractIntentSection(createAgentsFile())!)
    writeFileSync(agentsPath, updated)
    console.log(`Added intent section to existing AGENTS.md.`)
  }
  else {
    writeFileSync(agentsPath, createAgentsFile())
    console.log(`Created AGENTS.md with intent tracking.`)
  }
}

function initClaudeMd(agentsPath: string, claudePath: string): void {
  if (!existsSync(claudePath)) {
    symlinkSync('AGENTS.md', claudePath)
    console.log(`Created CLAUDE.md as symlink to AGENTS.md.`)
    return
  }

  const stat = lstatSync(claudePath)
  if (stat.isSymbolicLink()) {
    console.log(`CLAUDE.md is already a symlink.`)
    return
  }

  const content = readFileSync(claudePath, 'utf-8')
  if (content.includes(INTENT_START_MARKER)) {
    console.log(`Intent tracking already present in CLAUDE.md.`)
    return
  }

  const intentSection = extractIntentSection(readFileSync(agentsPath, 'utf-8'))
  if (intentSection) {
    const updated = injectIntent(content, intentSection)
    writeFileSync(claudePath, updated)
    console.log(`Added intent section to existing CLAUDE.md.`)
  }
}

function cmdInit(): void {
  const cwd = process.cwd()
  const agentsPath = resolve(cwd, 'AGENTS.md')
  const claudePath = resolve(cwd, 'CLAUDE.md')

  initAgentsMd(agentsPath)
  initClaudeMd(agentsPath, claudePath)

  for (const agent of getAgents())
    injectAgentRules(agent)
}

function cmdShow(): void {
  const agentsPath = resolve(process.cwd(), 'AGENTS.md')

  if (!existsSync(agentsPath)) {
    console.log(`No AGENTS.md found. Run \`intentracker init\` to set up intent tracking.`)
    process.exitCode = 1
    return
  }

  const content = readFileSync(agentsPath, 'utf-8')
  const intentSection = extractIntentSection(content)

  if (!intentSection) {
    console.log(`No intent section found in AGENTS.md. Run \`intentracker init\` to add one.`)
    process.exitCode = 1
    return
  }

  console.log(intentSection)
}

function printHelp(): void {
  const agents = Object.keys(AGENT_CONFIG).join(', ')
  console.log(`intentracker — Track project intent across agent sessions

Usage:
  intentracker init                          Initialize AGENTS.md + symlink CLAUDE.md
  intentracker init --agent cursor           Also inject rules into agent config
  intentracker init --agent cursor,windsurf  Inject rules for multiple agents
  intentracker show                          Display current intent
  intentracker help                          Show this help message

Supported agents: ${agents}`)
}

switch (command) {
  case 'init':
    cmdInit()
    break
  case 'show':
    cmdShow()
    break
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp()
    break
  default:
    console.log(`Unknown command: ${command}`)
    printHelp()
    process.exitCode = 1
}
