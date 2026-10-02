# VaidikaConnect

VaidikaConnect helps devotees find qualified Vaidika Pujaris for pujas, homams, life-cycle ceremonies, and related spiritual services.

## Product journey

1. Explore a ceremony or request a custom ritual.
2. Enter location, participant count, language, and ceremony preferences.
3. Review eligible pujari profiles, qualifications, experience, pricing, and availability.
4. Accept the fire-safety and no-guaranteed-outcome disclosures.
5. Submit a booking/request and track the status through confirmation.

The `manus-ai` branch prioritizes a clear, honest customer journey and the feature contracts required for live Supabase integration. It supports a demo catalog when no Supabase environment is configured, but production deployments should configure Supabase and a real notification/payment workflow.

## Stack

- Next.js 15 App Router and React 19
- TypeScript and Tailwind CSS
- Supabase Auth/Postgres/Storage
- Leaflet map rendering
- Bilingual English/Telugu content

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run typecheck
npm run build
npm run dev
```

The development server runs on port `9002`.

## Environment

At minimum, configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`. Optional integrations are documented in `docs/domain_and_deployment_setup.md`.

## Database

Apply the migrations in `supabase/migrations/` to a clean Supabase project in timestamp order. Verify RLS policies and the `match_purohits` RPC before enabling real bookings.

## Quality checks

```bash
npm run typecheck
npm run build
npm run lint
npx tsx scripts/run-e2e-tests.ts
```

Some E2E checks require configured Supabase credentials and seeded records.
