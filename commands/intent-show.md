# /intent:show

Read `AGENTS.md` (or `CLAUDE.md`) and display the `## Intent`
section to the user in a clean, readable format.

If no intent section exists, tell the user:
"No intent tracked yet for this project. Run `/intent:init`
to set up intent tracking, or `/intent:update` to capture
your current goals."

If intent exists, display it as-is and offer:
"Want to update anything? Just tell me what changed and I'll
update the intent, or run `/intent:update` for a guided flow."
