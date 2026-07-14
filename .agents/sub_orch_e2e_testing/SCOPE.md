# Scope: E2E Testing Track

## Architecture
The E2E Testing Track builds and executes a comprehensive test suite for VaidikaConnect.
- **Test Runner**: A programmatic, frameworkless Node.js/TypeScript script running in `scripts/run-e2e-tests.ts`. It executes 93 test cases, validates assertions using Node's native `assert` module, and logs progress.
- **Verification**: The runner can be run via `npx tsx scripts/run-e2e-tests.ts`. It checks actual implementations where available, otherwise verifies that un-implemented/stub components behave as expected or fail.
- **Output**: Generates `TEST_READY.md` upon completion with test tier details and coverage.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Design Test Suite | Enumerate 93 test cases across 4 tiers covering features F1-F8 | None | DONE |
| 2 | Implement Test Runner | Create `scripts/run-e2e-tests.ts` containing the test runner and 93 tests | M1 | DONE |
| 3 | Initial Run Verification | Run the test runner and verify it compiles, executes, and fails where features are not yet implemented | M2 | DONE |
| 4 | Publish Test Infra Docs | Create `TEST_INFRA.md` and `TEST_READY.md` | M3 | DONE |

## Test Case Inventory (93 Cases)

### Feature 1: Deterministic Matchmaking (F1)
#### Tier 1: Feature Coverage (5 tests)
- `F1T1_SectFilter`: Verify purohits are filtered strictly by sect (only requested sect returned).
- `F1T1_LanguageFilter`: Verify purohits are filtered strictly by language (only requested language returned).
- `F1T1_ProximitySort`: Verify results are ordered by distance ascending.
- `F1T1_BookingFreqTieBreaker`: Verify that when distances are identical, purohits with higher booking frequency are ranked first.
- `F1T1_Top3Limit`: Verify that only the top 3 recommendations are returned.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F1T2_EmptyResult`: Verify correct behavior (empty array) when no matching purohits exist.
- `F1T2_LargeDistance`: Verify distance calculation works over very large coordinates (e.g. opposite sides of the globe).
- `F1T2_ZeroCoords`: Verify matching works when coordinates are exactly (0,0).
- `F1T2_MultipleLanguages`: Verify matchmaking works when a purohit supports multiple languages and user requests one of them.
- `F1T2_NullOrMissingFields`: Verify robust error handling if some purohit records have null fields or invalid types.

### Feature 2: RLS security active on tables (F2)
#### Tier 1: Feature Coverage (5 tests)
- `F2T1_PurohitsAnonymousRead`: Anonymous user cannot read/write directly to `purohits`.
- `F2T1_PurohitsAuthenticatedRead`: Authenticated purohit can read own profile.
- `F2T1_BookingsAnonymousNoAccess`: Anonymous user cannot view bookings.
- `F2T1_BookingsCustomerAccessOwn`: Customer can read/write their own bookings only.
- `F2T1_GlobalSettingsReadWrite`: Authenticated users can read global settings, but only admin role can write.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F2T2_SqlInjectionSecCheck`: SQL Injection attempt in matchmaking or filter parameters is rejected.
- `F2T2_BookingTampering`: Authenticated user A tries to update user B's booking (must fail).
- `F2T2_UnauthenticatedBookingCreation`: Booking creation without authentication must be denied.
- `F2T2_GlobalSettingsWriteByNonAdmin`: Authenticated non-admin attempts to update `global_settings` (must fail).
- `F2T2_BypassRlsUsingRpc`: Check if the matchmaking RPC bypasses RLS and exposes private booking details.

### Feature 3: Live Crisis Hard-Routing (F3)
#### Tier 1: Feature Coverage (5 tests)
- `F3T1_BypassUnder2Hours`: Request with Muhurtham in 1h 30m is immediately routed to human coordinator.
- `F3T1_BypassExactLimit`: Request with Muhurtham in exactly 1h 59m is routed to human.
- `F3T1_StandardRouteOver2Hours`: Request with Muhurtham in 3 hours is routed to chatbot.
- `F3T1_StandardRouteFarFuture`: Request with Muhurtham in 5 days is routed to chatbot.
- `F3T1_ContactDetailsVerification`: Route output contains the correct phone number: `+91 98765 43210`.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F3T2_MuhurthamJustUnderLimit`: Muhurtham is 1 minute under 2 hours (119 mins) -> routes to human.
- `F3T2_MuhurthamJustOverLimit`: Muhurtham is 1 minute over 2 hours (121 mins) -> routes to chatbot.
- `F3T2_MuhurthamInPast`: Muhurtham is in the past -> routes to human (crisis).
- `F3T2_InvalidTimeFormat`: Handling of malformed date strings (must throw/gracefully reject).
- `F3T2_TimezoneOffsets`: Matchmaking Muhurtham time check with UTC vs local time differences.

### Feature 4: GST Invoicing (F4)
#### Tier 1: Feature Coverage (5 tests)
- `F4T1_DakshinaExempt`: Verify Dakshina has 0% GST applied.
- `F4T1_ConvFeeGst`: Verify convenience fee has 18% GST applied.
- `F4T1_TotalInvoiceCalculation`: Verify total invoice equals Dakshina + Fee + (Fee * 0.18).
- `F4T1_SplitDisplay`: Verify invoice splits Dakshina and convenience fee clearly.
- `F4T1_ZeroFeeInvoice`: Verify total calculation when convenience fee is zero.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F4T2_NegativeAmounts`: Negative Dakshina or fee throws error.
- `F4T2_RoundingCent`: Check correct rounding behavior to nearest paise/cent.
- `F4T2_ExtremelyLargeInvoice`: Very large dakshina amount does not cause numerical overflow.
- `F4T2_FloatPrecision`: Verification of floating point additions (avoid JS float precision bugs).
- `F4T2_ZeroDakshina`: Invoice with zero dakshina but valid convenience fee behaves correctly.

### Feature 5: Legal Waivers (F5)
#### Tier 1: Feature Coverage (5 tests)
- `F5T1_FireWaiverContent`: Checkout screen must contain Fire Hazard disclaimer.
- `F5T1_MetaphysicalWaiverContent`: Checkout screen must contain Metaphysical Outcome disclaimer.
- `F5T1_UserMustAcceptWaiver`: User cannot complete booking without accepting waivers.
- `F5T1_WaiverLogOnBooking`: Verify accepted waiver versions are logged on the booking record.
- `F5T1_WaiverRenderedCorrectly`: Verify disclaimers are visible in the checkout HTML.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F5T2_EmptyWaiverAcceptance`: Attempting to submit blank waiver acceptances is blocked.
- `F5T2_TamperedWaiverTexts`: Attempting to submit modified waiver texts is rejected.
- `F5T2_DoubleAcceptance`: Verifying double form submission doesn't create duplicate bookings or bypass waiver records.
- `F5T2_MobileViewportVisibility`: Ensure disclaimers are accessible on small screens.
- `F5T2_NullWaiverRecord`: Direct API call with null waiver status is rejected.

### Feature 6: Gotra, Nakshatra, and ancestral death dates saving in Profile settings (F6)
#### Tier 1: Feature Coverage (5 tests)
- `F6T1_SaveGotra`: Gotra string is saved and retrieved.
- `F6T1_SaveNakshatra`: Nakshatra is saved and retrieved.
- `F6T1_SaveAncestralDeathDates`: Ancestral death dates array is saved and retrieved.
- `F6T1_UpdateProfileSuccess`: Profile update returns success status.
- `F6T1_DisplayInProfilePage`: Settings are populated when profile page loads.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F6T2_EmptyGotraNakshatra`: Profile saves empty or blank values without crashing.
- `F6T2_InvalidNakshatraValue`: Rejecting non-standard Nakshatra names if validation is present.
- `F6T2_FutureDeathDate`: Attempting to save a future Gregorian date for an ancestral death date is rejected.
- `F6T2_LargeAncestorsArray`: Saving a large array of ancestral dates is handled gracefully.
- `F6T2_MalformedDateString`: Passing invalid date formats for death dates throws a validation error.

### Feature 7: Ancestral Lunar Tithi Tracker (F7)
#### Tier 1: Feature Coverage (5 tests)
- `F7T1_ConvertPratipada`: Verify a known date converts to Pratipada.
- `F7T1_ConvertDwitiya`: Verify another known date converts to Dwitiya.
- `F7T1_ConvertAmavasya`: Verify a new moon date converts to Amavasya.
- `F7T1_ConvertPurnima`: Verify a full moon date converts to Purnima.
- `F7T1_ValidTithiOutput`: Verify return value is one of the 30 standard Tithis.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F7T2_LeapYearTithi`: Verify Tithi calculation on Feb 29 of a leap year.
- `F7T2_FarFutureTithi`: Tithi calculation for a year in the far future.
- `F7T2_HistoricalTithi`: Tithi calculation for a historical date.
- `F7T2_TithiBoundaryChange`: Verification when a date shifts Tithi mid-day.
- `F7T2_InvalidDateInput`: Inputting an invalid date string/object to the tracker utility returns a clear error or falls back.

### Feature 8: WhatsApp Scheduled Notifications alerts (F8)
#### Tier 1: Feature Coverage (5 tests)
- `F8T1_Trigger14Days`: Scheduler registers trigger at T-14 days.
- `F8T1_Trigger7Days`: Scheduler registers trigger at T-7 days.
- `F8T1_Trigger3Days`: Scheduler registers trigger at T-3 days.
- `F8T1_NoTriggerOtherDays`: Scheduler does not send alerts at other times (e.g. T-10 days).
- `F8T1_WhatsAppPayloadStructure`: Verify outgoing message contains ceremony details and is properly formatted.
#### Tier 2: Boundary & Corner Cases (5 tests)
- `F8T2_AlertMissedCronRecovery`: If a cron runs late, it still catches events within the day.
- `F8T2_UserOptOut`: Notifications are not sent if user has opted out in settings.
- `F8T2_InvalidPhoneNumber`: Outgoing failure is handled gracefully when number is invalid.
- `F8T2_DoubleTriggers`: Ensures a reminder is sent exactly once per trigger window.
- `F8T2_UrgentMuhurtham`: If a ceremony is booked <3 days in advance, ensure appropriate logic.

### Tier 3: Cross-Feature Combinations (8 tests, pairwise)
- `F1_F2_T3_MatchmakingRls`: Matching query executes successfully and only returns purohits that have active/public listings (RLS checked).
- `F1_F3_T3_MatchmakingCrisis`: When user tries to match purohits for a muhurtham <2 hours away, matchmaking is bypassed and routed to crisis coordinator.
- `F1_F4_T3_MatchmakingInvoice`: Selecting a matched purohit calculates the invoice with correct split GST (Dakshina vs Fee) for that purohit's specific pricing.
- `F2_F6_T3_ProfileRls`: Profile settings (Gotra, Nakshatra, Death dates) can only be viewed and written to by the authenticated user themselves (RLS checked).
- `F4_F5_T3_InvoiceWaiverCheckout`: Checkout requires accepting the waivers (Fire, Metaphysical) before generating the split GST invoice and booking.
- `F6_F7_T3_ProfileTithiConvert`: Saving ancestral death dates in profile settings automatically converts them to lunar tithis for display.
- `F7_F8_T3_TithiWhatsAppAlert`: WhatsApp alerts are scheduled based on the calculated lunar tithi anniversary (using Gregorian conversion), triggering at 14, 7, and 3 days prior to the next lunar date.
- `F3_F8_T3_CrisisNoWhatsApp`: Crisis hard-routed bookings do not trigger standard scheduled automated WhatsApp notifications since they are managed manually.

### Tier 4: Real-world workload scenarios (5 tests)
- `RW_T4_StandardCustomerFlow`: Customer registers, edits profile (Gotra, Nakshatra), performs deterministic search for Smartha purohit speaking Telugu, finds top match, accepts waivers, completes checkout with split GST invoice, and schedules WhatsApp notifications for an ancestral tithi.
- `RW_T4_LastMinuteEmergency`: User visits site to book a puja scheduled in 1 hour. System detects crisis window, bypasses search/checkout, and displays human coordinator contact card.
- `RW_T4_AdminDashboardManagement`: Admin logs in, updates global settings, checks purohit bookings and billing reports showing correct GST splits, while verifying database constraints and RLS prevent unauthorized access.
- `RW_T4_TithiAnniversaryAlertCycle`: Background scheduler runs, translates ancestral dates of multiple profiles, identifies an upcoming tithi anniversary in 7 days, and triggers a formatted WhatsApp alert.
- `RW_T4_SectarianMatchmakingOverload`: Deterministic matching engine receives simultaneous requests from Smartha, Shaiva, and Vaishnava users. Returns correct top 3 candidates sorted by distance, with ties broken by booking frequency.
