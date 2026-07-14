# Scope: Supabase Schema & Matchmaking (Milestone 2)

## Architecture
This milestone introduces the core database tables and matchmaking capabilities for the VaidikaConnect platform on Supabase.
- **Data Layer**: Supabase PostgreSQL. Core tables: `public.purohits` and `public.bookings`.
- **Security Layer**: Row-Level Security (RLS) policies configured on `purohits`, `bookings`, and `global_settings`.
- **Matchmaking Engine**: Deterministic matchmaking using a database RPC function (`public.match_purohits`) that filters and ranks Purohits based on sect, languages, geographic proximity, and booking frequency.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Database Migration | Create `supabase/migrations/matchmaking.sql` to define tables, RLS policies, and the `match_purohits` function. | None | PLANNED |
| 2 | Codebase Sync & Compilation | Verify that any typescript interfaces or client code compile successfully. | M1 | PLANNED |
| 3 | Functional Verification | Test the matchmaking query and RLS policies using a test script. | M2 | PLANNED |

## Interface Contracts
### Supabase Schema ↔ Matchmaking RPC
- **Table `public.purohits`**:
  - `id` (UUID, PK)
  - `name` (TEXT, NOT NULL)
  - `sect` (TEXT, NOT NULL check: Smartha, Vaishnava, Shaiva)
  - `languages` (TEXT[], NOT NULL)
  - `latitude` (DOUBLE PRECISION, NOT NULL)
  - `longitude` (DOUBLE PRECISION, NOT NULL)
  - `booking_frequency` (INT, NOT NULL default 0)
- **Table `public.bookings`**:
  - `id` (UUID, PK, default gen_random_uuid())
  - `user_id` (UUID, NOT NULL references auth.users(id))
  - `purohit_id` (UUID, NOT NULL references public.purohits(id))
  - `muhurtham_time` (TIMESTAMP WITH TIME ZONE, NOT NULL)
  - `dakshina` (NUMERIC(10,2), NOT NULL)
  - `convenience_fee` (NUMERIC(10,2), NOT NULL)
  - `gst_amount` (NUMERIC(10,2), NOT NULL)
  - `total_amount` (NUMERIC(10,2), NOT NULL)
  - `fire_hazard_accepted` (BOOLEAN, NOT NULL default false)
  - `metaphysical_disclaimer_accepted` (BOOLEAN, NOT NULL default false)
  - `waiver_version` (TEXT, NOT NULL default '1.0')
  - `status` (TEXT, NOT NULL default 'pending')
  - `created_at` (TIMESTAMP WITH TIME ZONE, default now())
- **Function `match_purohits`**:
  - Signature: `public.match_purohits(user_sect TEXT, user_lang TEXT, user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION)`
  - Returns: `TABLE(id UUID, name TEXT, sect TEXT, languages TEXT[], distance DOUBLE PRECISION, booking_frequency INT)`
  - Sorting: Distance ASC, then booking_frequency DESC.
  - Limit: Exactly 3 records.
