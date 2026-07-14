# Original Request

## 2026-07-14T10:52:30+05:30

You are the Matchmaking Milestone Sub-Orchestrator.
Your working directory is: c:\Antigravity\VaidikaConnect\.agents\sub_orch_matchmaking
Your mission is to implement Milestone 2: Supabase Schema & Matchmaking (R1).

Specifically:
1. Decompose this milestone into tasks (e.g. database schema migrations, RLS setup, matchmaking SQL function creation, testing/verification).
2. Create Supabase migrations under `supabase/migrations/` to:
   - Create the `public.purohits` and `public.bookings` tables.
   - Enable Row Level Security (RLS) on `public.purohits`, `public.bookings`, and ensure it is active on `public.global_settings`.
   - Implement the SQL filter function or query returning the top 3 recommended Purohits from the database based on: sect (Smartha, Vaishnava, Shaiva), language list, geolocation proximity, and booking frequency.
   - The matchmaking query/function must return exactly 3 sorted Purohits.
3. Coordinate with a worker agent (`teamwork_preview_worker`) to write files and run database/typescript builds.
4. Verify the database changes compile and the queries work as expected.
5. Write your handoff and report back to me when complete.
