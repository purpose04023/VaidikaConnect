---
name: hindu-marketplace-builder
description: >-
  Vaidika Hindu marketplace builder for managing RLS security, deterministic matchmaking, split GST invoices, fire waivers, and Tithi trackers.
---

# Hindu Marketplace Builder

## Overview
This skill guides agents in building culturally authentic, secure, and regulatory-compliant Hindu marketplace applications. It prevents common flaws like algorithmic auto-assignment of sacred services, unverified web scraping of ritual instructions, and tax or liability exposure.

## Quick Start
To apply this skill, review the target repository's schema and verify that:
1. **Sectarian & Geo Filters** are deterministic (user-choice oriented).
2. **TDS and GST invoicing** are split.
3. **Fire Liability disclaimers** are active.

## Workflow

### 1. Deterministic Purohit Matchmaking Setup
Vedic rituals are not standard commodities. Users must retain agency to avoid cultural mismatch.
- **Matchmaking Engine:** Never auto-assign. Always query availability, distance, and rating, and present a ranked shortlist (top 3 options).
- **Lineage Preservation:** Query based on language, sect (Smartha, Vaishnava, Shaiva), and specialization (Vratams, Homams).

### 2. Legal & Financial Safety Clauses
Verify that checkout screens contain the following:
- **Fire Hazard Waiver:** "VaidikaConnect acts as an introductory marketplace. The host assumes all physical liability for ensuring fire-safety and ventilation during Homams."
- **GST Split Invoicing:** Priest Dakshina must be marked as GST-exempt, and platform convenience fees must be billed separately at 18% GST.
- **Metaphysical Disclaimer:** "Ritual efficacy is a spiritual matter. VaidikaConnect disclaims liability regarding outcomes."

### 3. Tithi Tracking & WhatsApp Engagement
Ancestral ceremonies (Shraddha, Tarpanam) are highly recurring.
- **Lunar Conversion:** Capture ancestral Gregorian dates and convert them to traditional Hindu lunar days (Tithis).
- **Reminders:** Send automated WhatsApp notifications to users 14, 7, and 3 days before the calculated lunar date.

## Common Mistakes
- **Auto-Matching:** Forcing a priest onto a user destroys trust (Gotra/Sect mismatch).
- **Scraping Rituals:** Never scrape the web for rare puja procedures; use a validated scholarly advisory board to avoid hallucinated blasphemy.
