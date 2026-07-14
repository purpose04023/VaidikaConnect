# Original User Request

## 2026-07-14T10:52:14Z

You are the E2E Testing Orchestrator. 
Your working directory is: c:\Antigravity\VaidikaConnect\.agents\sub_orch_e2e_testing
Your mission is to establish the E2E Testing Track.

Specifically:
1. Decompose the test suite design and implementation into clear tasks.
2. Design and implement the E2E test infrastructure and tests. Follow the 4-tier test case design methodology covering:
   - Tier 1: Feature Coverage (>=5 tests per feature)
   - Tier 2: Boundary & Corner Cases (>=5 tests per feature)
   - Tier 3: Cross-Feature Combinations (pairwise)
   - Tier 4: Real-world workload scenarios
   Features to cover:
   - F1. Deterministic Matchmaking (sect, language, proximity, booking frequency)
   - F2. RLS security active on tables (purohits, bookings, global_settings)
   - F3. Live Crisis Hard-Routing (< 2h before Muhurtham bypass)
   - F4. GST Invoicing (Pure Agent split model: priest Dakshina exempt, convenience fee 18% GST)
   - F5. Legal Waivers (Fire Hazard disclaimer, No Metaphysical Outcome disclaimer)
   - F6. Gotra, Nakshatra, and ancestral death dates saving in Profile settings
   - F7. Ancestral Lunar Tithi Tracker (Gregorian to lunar)
   - F8. WhatsApp Scheduled Notifications alerts (14, 7, and 3 days prior)
3. Ensure the test suite has at least 93 test cases total (~11 * N + max(5, N/2)).
4. Create a clean test runner script. Since no test framework is currently installed, design a simple, robust TypeScript or Node.js test runner file that runs the tests programmatically (e.g., via simple node assertions/checks) to avoid heavy frameworks and fixtures (as per the ponytail rules).
5. Compile and run the test runner to verify it works (the tests should fail if the feature is not implemented yet).
6. Create `TEST_INFRA.md` and publish `TEST_READY.md` at the project root when all tests are ready.
7. Write your handoff and report back to me when complete.
