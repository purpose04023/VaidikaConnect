## 2026-07-14T05:43:35Z
You are teamwork_preview_worker.
Your working directory is: c:\Antigravity\VaidikaConnect\.agents\teamwork_preview_worker_m2
Your task is to implement Milestone 2 (Supabase Schema & Matchmaking) in Supabase.

Please follow /ponytail mode (lazy senior dev mode):
- Keep database schemas and queries as simple as possible.
- Avoid unnecessary files, write clean minimal code.
- Always add the MANDATORY INTEGRITY WARNING checks.

Instructions:
1. Create a migration file `supabase/migrations/20260714120000_purohits_bookings_matchmaking.sql` (or similar next migration filename under `supabase/migrations/`).
2. The migration must:
   - Create table `public.purohits` with columns:
     - `id` uuid default gen_random_uuid() primary key
     - `name` text not null
     - `sect` text not null check (sect in ('Smartha', 'Vaishnava', 'Shaiva'))
     - `languages` text[] not null
     - `latitude` double precision not null
     - `longitude` double precision not null
     - `booking_frequency` integer default 0 not null
   - Create table `public.bookings` with columns:
     - `id` uuid default gen_random_uuid() primary key
     - `purohit_id` uuid references public.purohits(id) on delete cascade
     - `user_id` uuid references public.profiles(id) on delete set null
     - `muhurtham_time` timestamp with time zone not null
     - `status` text default 'pending' check (status in ('pending', 'confirmed', 'cancelled'))
     - `dakshina` numeric not null
     - `convenience_fee` numeric not null
     - `created_at` timestamp with time zone default now() not null
   - Enable Row Level Security (RLS) on both `public.purohits` and `public.bookings`.
   - Setup RLS policies:
     - For `purohits`: public read, admin write/all.
     - For `bookings`: users can read/insert/update their own bookings (matching `auth.uid() = user_id`), admins can do all.
     - Ensure RLS is active on `public.global_settings` (re-assert it if needed).
   - Implement the SQL filter function or query returning the top 3 recommended Purohits from the active database based on: sect (Smartha, Vaishnava, Shaiva), language list, geolocation proximity, and booking frequency.
     - Create function `match_purohits(user_sect text, user_lang text, user_lat double precision, user_lng double precision)` returning table `(id uuid, name text, sect text, languages text[], distance double precision, booking_frequency integer)`.
     - Inside the function, use a simple Euclidean distance formula to compute `distance`: `sqrt(power(latitude - user_lat, 2) + power(longitude - user_lng, 2))`.
     - Filter strictly by sect (`sect = user_sect`) and language (`user_lang = ANY(languages)`).
     - Sort by: `distance ASC`, then `booking_frequency DESC`.
     - Limit exactly 3 results.
3. Verify that the SQL is correct and clean.
4. Report back when you have created this migration file and verified it.

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-07-14T05:44:32Z
**Context**: Implement Supabase Schema & Matchmaking (R1) for Milestone 2.
**Content**: 
1. Please create a new migration file named `supabase/migrations/matchmaking.sql` to implement the Supabase schema and matchmaking.
The migration file should contain:
- Creation of `public.purohits` and `public.bookings` tables with appropriate constraints.
- Enabling Row Level Security (RLS) on `public.purohits`, `public.bookings`, and ensuring RLS is enabled/active on `public.global_settings`.
- Configuring RLS policies for `public.purohits` (read access for authenticated users, update/insert access for own profiles, and full access for admins), `public.bookings` (read/write access only for the matching `user_id` or admins), and `public.global_settings` (read access for public/all, write access only for admins).
- Implementing the `public.match_purohits` database function (RPC) that returns exactly/up to 3 recommended Purohits from the active database based on: sect (Smartha, Vaishnava, Shaiva), language list, geolocation proximity (using spherical law of cosines), and booking frequency (as a tie-breaker).
- Seeding the `public.purohits` table with 5 test records using static UUIDs and an idempotent `ON CONFLICT (id) DO UPDATE...` block.

2. Verify that the project compiles with no TypeScript errors by running:
`npm run typecheck` or `npm run build`.

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Action**: Implement the database migration, compile the project, and report back with execution details.

