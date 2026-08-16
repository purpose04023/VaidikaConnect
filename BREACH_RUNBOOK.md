# VaidikaConnect — Data Breach Response Runbook

> **LAWYER-REVIEW-REQUIRED** — Final runbook must be reviewed by qualified Indian data-protection /
> IT-law counsel before this document becomes operational procedure.

---

## 0. Classification

| Severity | Definition | Example |
|---|---|---|
| **P0 – Critical** | Confirmed exfiltration of personal data affecting >100 users OR any sensitive data | Database dump leaked; auth tokens exposed |
| **P1 – High** | Suspected breach with evidence; <100 users; no confirmed exfiltration yet | Unusual Supabase query spike; suspicious admin login |
| **P2 – Low** | Isolated incident, single user, no systemic compromise | User reports seeing another user's name in UI |

---

## 1. Immediate Response (0–1 hour)

1. **Detect & Confirm** — Verify the breach is real; collect evidence (logs, screenshots, timestamps).
2. **Contain**
   - Revoke affected Supabase API keys / access tokens immediately.
   - If database credentials are compromised: rotate Supabase service role key in Vercel env vars and redeploy.
   - Disable affected user accounts if credentials are exposed.
3. **Preserve Evidence** — Export Supabase logs, Vercel logs, and any related data before any cleanup.
4. **Assemble Response Team** — Notify: CTO / Founder, Grievance Officer, legal counsel.

---

## 2. Board / Promoter Notification (within 6 hours for P0, 24 hours for P1)

**Template — Internal Board Notice:**

```
Subject: [CONFIDENTIAL] Personal Data Breach — Incident #[ID] — [DATE]

To: Board of Directors / Promoters
From: Grievance Officer / [Name]
Date: [DATE TIME IST]

INCIDENT SUMMARY
────────────────
Date/Time detected: [ISO timestamp IST]
Severity: [P0 / P1 / P2]
Nature of breach: [Description — e.g., "Supabase RLS misconfiguration exposed profiles table"]
Data categories affected: [e.g., name, email, WhatsApp number, booking details]
Estimated number of Data Principals affected: [N]
Root cause (preliminary): [Description]

IMMEDIATE ACTIONS TAKEN
────────────────────────
[List containment steps already completed]

NEXT STEPS
──────────
1. Notify Data Protection Board of India (if P0) — within 72 hours of discovery.
2. Notify affected Data Principals — without undue delay after DPB notice.
3. Full RCA (Root Cause Analysis) — within 7 days.

This communication is privileged and confidential.
```

---

## 3. Data Protection Board of India (DPB) Notification (within 72 hours — P0 breaches)

**⚠️ LAWYER-REVIEW-REQUIRED** — DPB notification portal and exact format will be prescribed
by Rules under DPDP Act. Until Rules are notified, follow MeitY guidance. Consult counsel.

Required fields (expected per Draft Rules):
- Name and contact of Data Fiduciary
- Description of the breach (nature, categories, approximate number of affected principals)
- Likely consequences
- Measures taken / proposed
- Contact of Grievance Officer for DPB follow-up

**Send to:** Data Protection Board of India (portal URL TBD by MeitY — LAWYER-REVIEW-REQUIRED)
**Email (interim):** [DPB contact — LAWYER-REVIEW-REQUIRED]

---

## 4. Data Principal (User) Notification

**Trigger:** After DPB notification, or if DPB notification is not required (P1/P2) but affected users need to act (e.g., change password).

**Template — User Breach Notice Email:**

```
Subject: Important: Security Notice Regarding Your VaidikaConnect Account

Dear [Name],

We are writing to inform you of a security incident that may have affected your
VaidikaConnect account.

WHAT HAPPENED
We discovered on [DATE] that [brief non-technical description]. We took immediate
steps to contain the incident.

WHAT INFORMATION WAS INVOLVED
The following types of personal data may have been accessed:
• [List: e.g., name, email address, WhatsApp number]
• [Note any data confirmed NOT affected: e.g., "Passwords were NOT exposed — they are stored as one-way hashes."]

WHAT WE ARE DOING
• [Containment steps taken]
• [Security improvements being implemented]

WHAT YOU SHOULD DO
1. [If passwords may be affected]: Please change your password immediately at
   https://vaidika-connect.vercel.app/login (use "Forgot Password").
2. Be cautious of phishing emails impersonating VaidikaConnect.
3. If you notice suspicious activity, contact us immediately.

YOUR RIGHTS
You have the right to access, correct, and erase your personal data, and to
lodge a grievance. See: https://vaidikaconnect.com/data-rights

We sincerely apologise for this incident and the concern it may cause.

Grievance Officer
VaidikaConnect
privacy@vaidikaconnect.com
[Phone]
```

---

## 5. Post-Incident (7–30 days)

| Day | Action |
|---|---|
| 7 | Complete Root Cause Analysis (RCA) |
| 14 | Implement security fixes; re-test RLS policies |
| 14 | Update DPB with RCA findings (if P0) |
| 30 | Lessons-learned review; update runbook |
| 30 | Document closure in incident log |

---

## 6. Security Gaps Flagged During DPDP Audit (August 2026)

| Gap | Risk | Recommended Fix | Priority |
|---|---|---|---|
| No CAPTCHA on sign-up | Bot registrations, spam accounts, credential stuffing | Add hCaptcha or Cloudflare Turnstile | HIGH |
| Vercel Analytics loaded unconditionally | DPDP §7 consent requirement | Gated behind consent banner (done in this branch) | DONE |
| Cross-border data transfers (Supabase USA, Vercel USA) | DPDP §16 — need approved jurisdiction list | Monitor MeitY notifications; add SCCs | MEDIUM |
| No rate limiting on auth endpoints | Brute-force password attacks | Enable Supabase auth rate limits; add edge-level protection | HIGH |
| Password minimum only 6 chars | Weak passwords | Raise to 8 chars + complexity hint | LOW |
| No 2FA/MFA for admin accounts | Admin account takeover | Enable Supabase MFA for admin emails | HIGH |
| `console.error(error)` in signup exposes stack traces | Information leakage in client | Remove / replace with sanitised logging | LOW |

---

*Last updated: August 2026 | Owner: Grievance Officer | Review: Annually or after any P0 incident*
