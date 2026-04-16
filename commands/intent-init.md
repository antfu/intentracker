---
description: Initialize intent tracking for this project by analyzing project files and creating an Intent section in AGENTS.md
disable-model-invocation: true
---

# /intent:init

Initialize intent tracking for this project.

1. Check if `AGENTS.md` exists. If not, create it.
2. Check if an `## Intent` section exists. If it does,
   tell the user: "Intent tracking is already set up.
   Run `/intent:show` to see it or `/intent:update` to
   modify it."
3. If no intent section exists, analyze the project:
   - Read README.md, package.json, or equivalent project
     metadata if available.
   - Infer initial goals from the project structure.
   - Do NOT guess constraints or decisions — only capture
     what's evident from project files.
4. Present the inferred intent to the user for confirmation.
5. Ask: "Does this capture what you're building? What would
   you add or change?"
6. Write the confirmed intent to `AGENTS.md` with the
   self-describing preamble.
