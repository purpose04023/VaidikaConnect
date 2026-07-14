# Original User Request

## Initial Request — 2026-07-14T10:35:35+05:30

Implement an end-to-end, highly optimized, culturally authentic, and regulatory-compliant marketplace platform for Vedic Hindu ceremonies and Pujari services on the active VaidikaConnect repository.

Working directory: c:\Antigravity\VaidikaConnect
Integrity mode: demo

## Requirements

### R1. Deterministic Matchmaking & Schema
Implement a deterministic matching database schema and filter query:
- Create `public.purohits` and `public.bookings` tables in the Supabase database.
- RLS must be enabled on both tables.
- Create an SQL filter function or query returning the top 3 recommended Purohits from the active database based on: sect (Smartha, Vaishnava, Shaiva), language list, geolocation proximity, and booking frequency.

### R2. Live Crisis "Hard-Routing" Flow
Implement a crisis management routing mechanism. Any ritual scheduling dispute or delay reported within 2 hours of the Muhurtham must bypass the chatbot and hard-route to a human coordinator (+91 98765 43210).

### R3. GST Invoicing & Legal Waivers
- Add pricing detail components supporting a "Pure Agent" invoice model, splitting GST-exempt Priest Dakshina from the 18% GST-taxed convenience fee.
- Add visible, legally compliant "Fire Hazard Disclaimer" for Homams and a "No Metaphysical Outcomes Guarantee" disclaimer to the terms and checkout screens.

### R4. Tithi Calendar Tracker & WhatsApp Loop
- Implement an ancestral lunar tithi tracker that computes Hindu calendar tithis from standard dates.
- Configure scheduled WhatsApp notification alerts 14, 7, and 3 days prior to annual Shraddha/Tarpanam ceremonies.

## Acceptance Criteria

### Technical
- [ ] Row Level Security (RLS) is active on all tables, including `purohits`, `bookings`, and `global_settings`.
- [ ] Database contains the matching query returning exactly 3 sorted Purohit records.
- [ ] All code compiles successfully with no TypeScript errors under `npm run build`.

### UI/UX
- [ ] The app uses Inter and Outfit fonts with saffron and golden accent variables (`--primary: 37 69% 50%`).
- [ ] Checkout panel displays the split invoice correctly.
- [ ] Profile settings allow users to save Gotra, Nakshatra, and ancestral death dates.
