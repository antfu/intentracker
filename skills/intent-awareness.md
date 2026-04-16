# Intent Awareness

When the user gives a directive that changes the direction of
the project (not just a specific code task, but a change in
goals, scope, approach, or constraints), note this internally
and ensure it will be captured at the next intent reconciliation.

Examples of direction-changing statements:
- "Actually, let's make this a web app instead of a CLI"
- "We should drop the real-time feature for v1"
- "I don't want any external dependencies"
- "Let's switch from REST to GraphQL"

Examples of statements that are NOT direction changes:
- "Fix the bug in the auth middleware"
- "Rename this variable"
- "Add a test for the edge case we discussed"

When you detect a direction change, you may proactively confirm:
"Got it — I'll update the project intent to reflect [change].
You can review it anytime with `/intent:show`."
