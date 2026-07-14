# Handoff Report - Codebase Investigation & Verification

## 1. Observation

### Next.js & Directory Layout
- **Version & Routing**: 
  - `package.json` contains:
    ```json
    "next": "15.5.9",
    "react": "^19.2.1"
    ```
  - The project utilizes the **App Router** layout inside the `src/app` directory.
  - **Routes mapped in `src/app`**:
    - Homepage: `src/app/page.tsx`
    - Profile: `src/app/profile/page.tsx`
    - Priest Discovery: `src/app/find-pujari/page.tsx`
    - Pujari Profile: `src/app/pujari/[id]/page.tsx`

### Supabase Setup & Local Mock Data
- **Supabase Clients**:
  - Browser Client: `src/utils/supabase/client.ts` using `@supabase/ssr` `createBrowserClient`
  - Server Client: `src/utils/supabase/server.ts` using `@supabase/ssr` `createServerClient`
- **Database Migrations (`supabase/migrations/`)**:
  - `schema.sql`: Sets up core tables `public.profiles`, `public.programs`, `public.stotrams`, `public.global_settings`, and `public.join_requests`.
  - `aalaya-sannidi.sql`: Configures public feed tables `aalaya_posts`, `aalaya_comments`, and `aalaya_likes`.
  - `custom-pooja-matching.sql`: Configures `pooja_embeddings` (pgvector 768), `regional_deity_aliases`, `custom_ritual_orders`, and `match_poojas` similarity search RPC.
  - `custom_pooja_requests.sql`: Configures the `custom_pooja_requests` table with RLS.
- **Local Mock Data**:
  - `src/lib/data.ts`: Exports in-memory static arrays `pujas` and `pujaris` mimicking database records and exports utility functions (`getPujas()`, `getPujariById()`, `getPujaris()`, `getPujaById()`) with simulated network delays.
  - `localStorage` Cache: Form submissions and checkout updates fall back to the `localStorage` key `"mock_custom_pooja_requests"` in `src/features/pooja/components/custom-pooja-form.tsx` and `src/app/profile/page.tsx`.

### Styling & CSS Variable Configurations
- **Fonts**:
  - Line 3 of `src/app/globals.css` imports font families:
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
    ```
  - Line 90 of `globals.css` defines the body font family:
    ```css
    body {
      font-family: 'Lato', Arial, Helvetica, sans-serif;
      ...
    }
    ```
  - Line 102 of `globals.css` maps headlines to `Inter`:
    ```css
    h1, h2, h3, .font-headline {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      ...
    }
    ```
  - **Outfit** is not referenced, imported, or configured anywhere in the project.
- **Saffron/Golden Colors**:
  - Configured inside `globals.css` as:
    ```css
    :root {
      --primary: 37 69% 50%;         /* Warm saffron/gold adjusted for light contrast */
      --accent: 33 100% 45%;          /* Deep divine saffron */
      --glow-primary: 37deg 69% 50%;
      --glow-gold: 37deg 69% 50%;
      --glow-saffron: 33deg 100% 45%;
    }
    .dark {
      --primary: 37 69% 64%;         /* Ethereal Glowing Gold (#E4B363) */
      --accent: 33 100% 50%;          /* Mystic Saffron (#FF8C00) */
      --glow-primary: 37deg 69% 64%;
      --glow-gold: 37deg 69% 64%;
      --glow-saffron: 33deg 100% 50%;
    }
    ```
  - Buttons (`.divine-button` class in `globals.css` line 247) use:
    ```css
    background: linear-gradient(135deg, #FF8C00 0%, #E4B363 100%);
    ```

### Forms, Priest Lists, Profile Settings, and Checkout UI
- **Booking Forms**: `src/features/pooja/components/custom-pooja-form.tsx` (`CustomPoojaForm` collects name, phone, description, date, time, pandit count, location, budget, notes).
- **Priest Lists**: `src/features/pujari/components/PoojariSearchFlow.tsx` displays nearby priests and maps them using Leaflet's `LocationMap`.
- **Profile Gotra/Nakshatra Settings**: Gotra and Nakshatra fields are completely absent from both profile forms and schemas.
- **Checkout & Payment UI**: No payment gateway is integrated. In `src/app/profile/page.tsx` (lines 90-149), requests with status `price_assigned` present a "Confirm & Book Pooja" button. Confirming books the ceremony in the DB/cache and triggers a success notification. In `PoojariSearchFlow.tsx` (lines 437-493), checkout actions open call and chat buttons pointing directly to the Pujari's phone number.

### Testing Frameworks
- `package.json` includes no testing framework dependencies (no Jest, Vitest, Playwright, Cypress).
- `scripts/test-query.ts` exists, but is a utility script to test querying the Supabase database.

### Calendar & Tithi Tracking
- No calendar or Tithi tracking libraries or helpers exist in `package.json` or the codebase.
- `src/components/ui/calendar.tsx` is a standard shadcn UI wrapper around `react-day-picker` for selecting dates in forms.

---

## 2. Logic Chain

1. **Next.js Routing**: Based on the directory scan showing the presence of `src/app/layout.tsx` and nested `page.tsx` files inside `profile`, `find-pujari`, and `pujari`, combined with `"next": "15.5.9"` in `package.json`, we logically conclude the project runs on Next.js 15 App Router.
2. **Supabase & Fallback Integration**: In `src/app/profile/page.tsx` and `src/features/pooja/components/custom-pooja-form.tsx`, we observe `fetch("/api/custom-pooja-request")` calls alongside `localStorage` updates to `"mock_custom_pooja_requests"`. This shows that the application operates on a hybrid Supabase database and local storage caching model.
3. **Outfit Font Status**: The absence of any font imports containing "Outfit" in `src/app/globals.css` and the lack of "Outfit" references in `tailwind.config.ts` confirms that the Outfit font is not currently integrated.
4. **Checkout Workflow**: The absence of external payment packages (e.g. Stripe, Razorpay) in `package.json` and the direct integration of contact actions (`tel:` and `wa.me`) in `PoojariSearchFlow.tsx`, as well as confirmation updates in `profile/page.tsx`, prove that the checkout flow is manual and communication-based.

---

## 3. Caveats
- Database configurations were reviewed purely based on local SQL migration files in `supabase/migrations/`; actual live database schema states on Supabase remote servers were not inspected.
- The verification was read-only, conforming strictly to the team protocol.

---

## 4. Conclusion
- The layout is Next.js 15 (App Router).
- Supabase exists alongside a local storage fallback cache.
- Font styling relies on 'Lato' and 'Inter'. Outfit is missing. Accents are configured using custom HSL values for Saffron/Gold.
- Booking forms, priest lists, and mock booking confirmations are present. Gotra and Nakshatra profile settings are completely missing.
- No testing frameworks or Hindu Tithi/Calendar tracking helpers exist.

---

## 5. Verification Method

To verify these observations independently:
1. **Directory layout**: Run `dir src/app` to verify route structure.
2. **Font configurations**: Run a search for `Outfit` using grep: `git grep -i outfit` (will return no matches).
3. **Database migrations**: Inspect files under `supabase/migrations/` using `view_file` to confirm table specifications.
4. **Mock data**: Inspect `src/lib/data.ts` to see structural layout.
