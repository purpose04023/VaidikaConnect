# E2E Test Infra: VaidikaConnect

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Deterministic Matchmaking | ORIGINAL_REQUEST §F1 | 5 | 5 | ✓ |
| 2 | RLS security active | ORIGINAL_REQUEST §F2 | 5 | 5 | ✓ |
| 3 | Live Crisis Hard-Routing | ORIGINAL_REQUEST §F3 | 5 | 5 | ✓ |
| 4 | GST Invoicing | ORIGINAL_REQUEST §F4 | 5 | 5 | ✓ |
| 5 | Legal Waivers | ORIGINAL_REQUEST §F5 | 5 | 5 | ✓ |
| 6 | Gotra, Nakshatra Profile settings | ORIGINAL_REQUEST §F6 | 5 | 5 | ✓ |
| 7 | Ancestral Lunar Tithi Tracker | ORIGINAL_REQUEST §F7 | 5 | 5 | ✓ |
| 8 | WhatsApp Scheduled Notifications | ORIGINAL_REQUEST §F8 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: programmatic script located at `scripts/run-e2e-tests.ts`. Run with `npx tsx scripts/run-e2e-tests.ts`.
- Test case format: programmatic tests inside a TestCase registry array. Assertions are handled using Node's standard `assert` module.
- Directory layout:
  - `scripts/run-e2e-tests.ts` contains the runner and all test cases.
  - Tests check for existence of modules and tables, failing gracefully if they are missing or return incorrect outputs.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | RW_T4_StandardCustomerFlow | F1, F2, F4, F5, F6, F7, F8 | High |
| 2 | RW_T4_LastMinuteEmergency | F3 | Medium |
| 3 | RW_T4_AdminDashboardManagement | F2, F4 | Medium |
| 4 | RW_T4_TithiAnniversaryAlertCycle | F7, F8 | High |
| 5 | RW_T4_SectarianMatchmakingOverload | F1 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
