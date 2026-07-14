# Project: VaidikaConnect Hindu Marketplace

## Architecture
VaidikaConnect is a Next.js 15 App Router application with a Supabase database backend. 
- **Database Layer**: Supabase PostgreSQL. Tables: `public.purohits`, `public.bookings`, `public.global_settings`. Row-Level Security (RLS) is enabled on all tables. Supabase RPC functions are used for deterministic matching queries.
- **Frontend Layer**: React 19 client components with Tailwind CSS styling. Accent colors utilize saffron/gold HSL variables, and typography integrates Inter and Outfit fonts.
- **Tithi Tracker Layer**: Standard date utilities that calculate ancestral Hindu lunar tithis from Gregorian dates.
- **WhatsApp Notification Loop**: Triggers scheduled alerts 14, 7, and 3 days before annual Shraddha/Tarpanam ceremonies.
- **Crisis Routing**: A client-side routing utility that redirects bookings close to the Muhurtham directly to a human coordinator, bypassing the standard chatbot loop.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Track | Implement comprehensive E2E test suite covering all features; create `TEST_READY.md` | None | DONE |
| 2 | Supabase Schema & Matchmaking (R1) | Create tables `purohits` and `bookings`, configure RLS on all tables (including `global_settings`), implement deterministic matchmaking function returning top 3 recommendations. | None | IN_PROGRESS (Conv ID: 43decbee-af10-439d-b49c-f3e130177a1e) |
| 3 | Live Crisis hard-routing flow (R2) | Implement crisis flow routing scheduling disputes <2h before Muhurtham to a human coordinator (+91 98765 43210). | None | PLANNED |
| 4 | GST Invoicing, Legal Waivers & Font Updates (R3) | Implement pure agent split invoice (ex-GST dakshina / 18% fee GST), Fire Hazard & Metaphysical Outcome disclaimers, integrate Outfit font, saffron accents. | None | PLANNED |
| 5 | Tithi Tracker, Profile Settings & WhatsApp Triggers (R4) | Implement Gregorian to lunar tithi calculations, Gotra/Nakshatra/ancestral death dates saving in Profile settings, and WhatsApp scheduler triggers. | None | PLANNED |
| 6 | E2E Verification & Adversarial Hardening (Final Milestone) | Pass 100% of E2E tests, execute Tier 5 adversarial checks, run forensic audit. | M1, M2, M3, M4, M5 | PLANNED |

## Interface Contracts
### Supabase Schema ↔ Matchmaking RPC
- Table `public.purohits`:
  - `id` (UUID, PK)
  - `name` (TEXT)
  - `sect` (TEXT: Smartha, Vaishnava, Shaiva)
  - `languages` (TEXT[])
  - `latitude` (DOUBLE PRECISION)
  - `longitude` (DOUBLE PRECISION)
  - `booking_frequency` (INT)
- Function `match_purohits(user_sect TEXT, user_lang TEXT, user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION)` returns `TABLE(id UUID, name TEXT, sect TEXT, languages TEXT[], distance DOUBLE PRECISION, booking_frequency INT)`

### Crisis Routing Utility
- Function `is_crisis_window(muhurtham_time TEXT | Date) -> boolean`: Determines if current time is within 2 hours of Muhurtham.
- If true, routes scheduling disputes/delays to human coordinator: `+91 98765 43210`.

### Tithi Tracker Utility
- Function `get_tithi_for_date(date: Date) -> string`: Computes ancestral lunar tithi (e.g., Pratipada, Dwitiya, etc.) for a standard Gregorian date.

## Code Layout
- `src/features/pujari`: Purohit matching and listing components.
- `src/features/bookings`: Booking components and checkout views.
- `src/lib/tithi`: Tithi tracking utilities and data.
- `src/lib/notifications`: WhatsApp schedule logic.
- `supabase/migrations/`: SQL migration files.
- `src/app/globals.css`: Stylesheet with font imports and primary accent color settings.
