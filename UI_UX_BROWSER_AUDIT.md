# VaidikaConnect UI/UX Browser Audit

**Audit target:** `manus-ai` branch preview at https://9002-ibfc2fhdvpb6s9az0d6v7-ba766156.sg2.manus.computer/
**Public main comparison:** https://vaidika-connect.vercel.app/
**Date:** 2026-10-02

## Evidence

- Chromium screenshots were captured at 360x800, 768x1024, and 1280x800.
- The branch HTML includes the shared footer and `public/manus-routes.json` responds with HTTP 200 locally.
- Browser QA confirmed the home page, footer, navigation menus, language/theme controls, discovery route, participant input, map/list layout, and pujari action buttons render.

## Confirmed findings

1. **Tablet secondary navigation is too crowded.** At 768px the second pill navigation remains visible and wraps labels such as “Vaidika Poojas”, “Life Cycle Poojas”, “Spiritual & Services”, and “Pilgrimage & Temples” into narrow columns. This is visually noisy and reduces usable hero space. Fix: show the secondary category navigation at `lg` and above; use the primary header/mobile menu below.
2. **The mobile discovery form is stacked but visually dense.** The location input, participant input, and action buttons fit at 360px, but the form needs consistent labels and vertical rhythm. Preserve the current touch-friendly 44px controls while improving grouping and labels.
3. **Consent banner overlaps lower content and the complaint FAB on small screens.** The fixed consent panel occupies most of the lower-right viewport on mobile/tablet. Fix: reserve a lower safe-area offset for the complaint FAB and use a slightly more compact mobile consent panel without reducing readability.
4. **The desktop/tablet header uses two navigation rows.** This is intentional for broad discovery, but the secondary row should not appear on tablet widths where it wraps.
5. **Footer is present in the `manus-ai` branch.** It was missing from the old public `main` deployment because that domain was serving the main branch; the branch server renders the complete footer with services, legal, contact, WhatsApp, and privacy links.
6. **The discovery route initially shows a loading state before the static/demo data resolves.** This is acceptable but should retain a clear skeleton/empty-state boundary for live Supabase loading.

## Browser behavior confirmed

- Programs dropdown opens and exposes Vaidika Poojas and Life Cycle Poojas.
- Discovery route exposes location, participant count, Search, device location, map, verified pujari cards, Call Now, Chat, and Book Now actions.
- Footer links and social/contact actions are rendered in the branch.
- Privacy banner has explicit Accept, Decline, close, and Learn more actions.
