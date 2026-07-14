# BRIEFING — 2026-07-14T10:52:30+05:30

## Mission
Implement Milestone 2: Supabase Schema & Matchmaking (R1) with deterministic matchmaking, correct RLS policies, and verified builds.

## 🔒 My Identity
- Archetype: sub_orch_matchmaking
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: c:\Antigravity\VaidikaConnect\.agents\sub_orch_matchmaking
- Original parent: main agent
- Original parent conversation ID: 461106b5-3802-41e3-b2b5-6f3223b14210

## 🔒 My Workflow
- **Pattern**: Project (Sub-orchestrator)
- **Scope document**: c:\Antigravity\VaidikaConnect\.agents\sub_orch_matchmaking\SCOPE.md
1. **Decompose**: Decompose the matchmaking milestone into subtasks (schema migration, matchmaking query implementation, verification).
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Spawn Explorer -> Worker -> Reviewer -> Challenger -> Auditor to design, implement, and verify the Supabase schema and matchmaking function.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Spawn successor if cumulative spawn count >= 16.
- **Work items**:
  - Decompose & Scope [pending]
  - Iteration loop for Supabase Schema & Matchmaking [pending]
  - Integration with Project E2E Tests [pending]
- **Current phase**: 1
- **Current focus**: Decompose & Scope

## 🔒 Key Constraints
- Never write, modify, or create source code files directly.
- Never run build/test commands yourself — require workers to do so.
- RLS must be enabled on `public.purohits`, `public.bookings`, and ensure it is active on `public.global_settings`.
- Matchmaking query/function must return exactly 3 sorted Purohits based on sect, language list, geolocation proximity, and booking frequency.
- Top-level parent is `461106b5-3802-41e3-b2b5-6f3223b14210`.

## Current Parent
- Conversation ID: 461106b5-3802-41e3-b2b5-6f3223b14210
- Updated: not yet

## Key Decisions Made
- [TBD]

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| 61ef0f89 | teamwork_preview_worker | Implement schema & matchmaking | in-progress | 61ef0f89-9c63-4d10-9bbb-112e863fe216 |

## Succession Status
- Succession required: no
- Spawn count: 1 / 16
- Pending subagents: 61ef0f89-9c63-4d10-9bbb-112e863fe216
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 43decbee-af10-439d-b49c-f3e130177a1e/task-27
- Safety timer: 43decbee-af10-439d-b49c-f3e130177a1e/task-123

## Artifact Index
- c:\Antigravity\VaidikaConnect\.agents\sub_orch_matchmaking\progress.md — progress tracker
- c:\Antigravity\VaidikaConnect\.agents\sub_orch_matchmaking\SCOPE.md — milestone scope decomposition
