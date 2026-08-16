# DPDP Act Compliance Progress — VaidikaConnect

**Branch:** `compliance/dpdp`
**Started:** August 2026
**Last Updated:** August 2026
**Status:** 🟡 In Progress — Pending lawyer review before merge to main / production

---

## Summary

This branch implements the first-pass technical compliance controls for India's
**Digital Personal Data Protection Act, 2023 (DPDP Act)**. It does not push to
production — all changes are on the `compliance/dpdp` branch.

---

## What Was Built

| # | Item | Status | File(s) |
|---|---|---|---|
| 1 | **Privacy Notice (DPDP-compliant)** | ✅ Done | `src/app/privacy/page.tsx` |
| 2 | **Data Rights Request Form** (access/correct/erase/withdraw/nominate) | ✅ Done | `src/app/data-rights/page.tsx` |
| 3 | **Consent Banner** (Vercel Analytics gated behind opt-in) | ✅ Done | `src/components/ConsentBanner.tsx` |
| 4 | **Analytics gated in layout** (disabled until consent) | ✅ Done | `src/app/layout.tsx` |
| 5 | **Signup consent checkboxes** (privacy+terms mandatory; marketing optional; all unticked) | ✅ Done | `src/app/signup/page.tsx` |
| 6 | **Consent record stored** (in Supabase auth metadata at signup) | ✅ Done | `src/app/signup/page.tsx` |
| 7 | **Data Protection clause in Terms of Service** (§8) | ✅ Done | `src/app/terms/page.tsx` |
| 8 | **Grievance Officer in Footer** | ✅ Done | `src/components/common/Footer.tsx` |
| 9 | **Grievance Officer in Privacy Notice** | ✅ Done | `src/app/privacy/page.tsx` |
| 10 | **Data Rights link in Footer** | ✅ Done | `src/components/common/Footer.tsx` |
| 11 | **Breach Runbook** (72h DPB notice + user notice templates) | ✅ Done | `BREACH_RUNBOOK.md` |
| 12 | **Security gap register** | ✅ Done | `BREACH_RUNBOOK.md §6` |

---

## Personal Data Collection Points Found

| Location | Data Collected | DPDP Basis |
|---|---|---|
| `/signup` | Name, email, password, WhatsApp | Contract + Consent |
| `/join-network` | Pujari profile (name, photo, experience, WhatsApp, location) | Contract |
| `api/custom-pooja-request` | Ceremony description, address, date, deity, WhatsApp | Contract |
| `api/checkout` | Booking confirmation data | Contract |
| `api/support/voice-triage` | Support message, contact info | Legitimate interest |
| `/find-pujari` | GPS lat/lng (browser permission) | Consent |
| `Vercel Analytics` (layout) | Anonymised page views (no cookies) | Consent (now gated) |
| `ComplaintBot` | Complaint text, contact info | Legitimate interest |

---

## Third-Party Services

| Service | Data | Country | Safeguard Needed |
|---|---|---|---|
| Supabase | All personal data | USA | SCCs — LAWYER-REVIEW-REQUIRED |
| Vercel | Anonymised analytics + hosting | USA | SCCs — LAWYER-REVIEW-REQUIRED |
| Assigned Pujari | User name, WhatsApp, ceremony details | India | Contractual clause in Pujari T&C |

---

## What Needs Lawyer Review (LAWYER-REVIEW-REQUIRED items)

1. **Legal entity details** — Company name, registration number, registered address (Privacy Notice §1)
2. **Grievance Officer name** — Must be a named individual per DPDP Act
3. **Cross-border transfers (§16)** — Confirm Supabase (USA) and Vercel (USA) are in approved jurisdictions once MeitY publishes the list
4. **Data-localisation obligations** — Check if ritual/religious data triggers sector-specific rules
5. **Minor consent (§9)** — Confirm age-gate mechanism required under final DPDP Rules
6. **Vercel Analytics consent requirement** — Confirm whether aggregate/anonymous data requires consent or qualifies as legitimate interest
7. **DPB notification portal** — Confirm the correct submission mechanism once DPB is constituted
8. **Pujari data processor agreement** — Pujaris who receive user data should sign a data-sharing / processor agreement
9. **Retention periods** — Validate 3-year booking retention against applicable Indian laws (GST, IT Act)
10. **Marketing consent opt-out mechanism** — Confirm unsubscribe flow satisfies DPDP Rules

---

## Open Technical Items (Not Yet Implemented)

| Item | Priority | Notes |
|---|---|---|
| CAPTCHA on sign-up | HIGH | Add hCaptcha or Cloudflare Turnstile to block bots |
| Rate limiting on auth | HIGH | Enable Supabase auth rate limits + Vercel edge rules |
| MFA for admin accounts | HIGH | Enable in Supabase Auth for admin email addresses |
| `data_rights_requests` Supabase table | MEDIUM | Create migration for the Data Rights form to persist to |
| Consent record in dedicated table | MEDIUM | Move consent from auth metadata to a `consent_records` table for auditability |
| Pujari join-network consent checkbox | MEDIUM | Add privacy/terms consent to `/join-network` form |
| Login page consent reminder | LOW | Add "By signing in you agree to our Privacy Notice" link |
| Password complexity | LOW | Raise minimum to 8 chars; add strength indicator |

---

## How to Apply to Production

1. Get lawyer sign-off on all LAWYER-REVIEW-REQUIRED items.
2. Fill in real entity details, Grievance Officer name, and DPB contact.
3. Create the `data_rights_requests` Supabase table (SQL migration needed).
4. Resolve all open technical items above.
5. Test consent banner, signup flow, and data-rights form end-to-end.
6. PR review by technical lead.
7. Merge `compliance/dpdp` → `main` and deploy.
