# /intent:update

Guide the user through updating their project intent.

If no `AGENTS.md` or `## Intent` section exists:
1. Ask: "What are you building? What are the main goals?"
2. Ask: "Any constraints I should know about? (tech stack,
   performance requirements, things to avoid)"
3. Ask: "Any decisions you've already made that I should
   track?"
4. Create `AGENTS.md` with the `## Intent` section populated
   from their answers. Include the self-describing preamble.
5. Confirm with a summary of what was captured.

If intent already exists:
1. Show the current intent.
2. Ask: "What's changed? You can update goals, add
   constraints, record decisions, or add open questions."
3. Apply their changes to the appropriate subsections,
   following the snapshot vs. append-only rules.
4. Confirm with a summary of what changed.

Keep the conversation natural. Don't make it feel like filling
out a form.
