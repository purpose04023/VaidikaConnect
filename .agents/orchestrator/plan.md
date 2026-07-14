# Project Implementation Plan - VaidikaConnect

## Objective
Implement an end-to-end, highly optimized, culturally authentic, and regulatory-compliant marketplace platform for Vedic Hindu ceremonies and Pujari services on the active VaidikaConnect repository.

## Phase 1: Codebase Exploration
- [ ] Spawn an Explorer subagent (`teamwork_preview_explorer`) to analyze the existing codebase.
- [ ] Understand the page routing (App Router vs Pages Router), database connections, schemas, current models, utility folders, and font configurations.
- [ ] Review how bookings and priest profiles are handled currently.
- [ ] Produce `PROJECT.md` at the project root containing architecture, milestones, and code layout.

## Phase 2: Dual Track Setup (Testing & Implementation)
- [ ] Spawn **E2E Testing Orchestrator** in parallel.
  - Setup test runner and write E2E test cases covering:
    - Tier 1: Feature Coverage (Deterministic Matchmaking, Crisis routing, Split Invoicing/Waivers, Tithi calculation & WhatsApp alerts)
    - Tier 2: Boundary & Corner Cases (within 2h Muhurtham limit, split invoicing amounts, extreme/invalid dates)
    - Tier 3: Cross-Feature Combinations (booking with different sects/languages, matching with proximity and booking frequency, etc.)
    - Tier 4: Real-world user scenario workloads
  - Publish `TEST_READY.md` upon completion.
- [ ] Spawn **Sub-Orchestrators** for milestones sequentially/parallelly:
  - **Milestone 1: Supabase Schema & Matchmaking Query (R1)**
    - Tables: `public.purohits`, `public.bookings` (enable RLS)
    - SQL Function/Query returning top 3 matching Purohits (sect, language, proximity, booking frequency)
  - **Milestone 2: Live Crisis Hard-Routing Flow (R2)**
    - Ritual scheduling disputes/delays < 2h before Muhurtham bypass chatbot and route to human coordinator (+91 98765 43210)
  - **Milestone 3: GST Invoicing & Legal Waivers (R3)**
    - "Pure Agent" invoice model splitting GST-exempt Dakshina and 18% taxed convenience fee
    - Disclaimers: Fire Hazard (Homams) and No Metaphysical Outcomes Guarantee
  - **Milestone 4: Tithi Calendar Tracker & WhatsApp alerts (R4)**
    - Hindu lunar calendar calculations from Gregorian dates
    - Scheduled WhatsApp notification triggers 14, 7, and 3 days before Shraddha/Tarpanam

## Phase 3: E2E Integration and Verification
- [ ] Integrate and run all E2E tests against the implementation.
- [ ] Fix TypeScript, build, and test issues.
- [ ] Perform Adversarial Coverage Hardening (Tier 5) on the implementation.

## Phase 4: Forensic Audit & Victory Report
- [ ] Run Forensic Auditor (`teamwork_preview_auditor`) to verify implementation integrity.
- [ ] Verify clean audit result (Zero Tolerance policy).
- [ ] Submit victory report to Sentinel.
