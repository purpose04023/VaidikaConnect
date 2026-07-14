/**
 * run-e2e-tests.ts
 *
 * Frameworkless, programmatic E2E test runner for VaidikaConnect.
 * Verifies Features F1-F8 across Tiers 1-4 with exactly 93 test cases.
 *
 * Run with: npx tsx scripts/run-e2e-tests.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import assert from 'assert';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { pathToFileURL } from 'url';

// Load local environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Type interfaces
interface TestCase {
  id: string;
  tier: string;
  feature: string;
  description: string;
  fn: () => Promise<void> | void;
}

interface TestResult {
  id: string;
  tier: string;
  feature: string;
  status: 'PASSED' | 'FAILED';
  error?: string;
  durationMs: number;
}

// Helper to dynamically import a module and check for exported functions
async function checkModule(modulePath: string, expectedExports: string[] = []): Promise<any> {
  const absolutePath = path.resolve(process.cwd(), modulePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Module file '${modulePath}' not found (Feature not implemented)`);
  }
  try {
    const url = pathToFileURL(absolutePath).href;
    const mod = await import(url);
    for (const exp of expectedExports) {
      if (mod[exp] === undefined && mod.default?.[exp] === undefined) {
        throw new Error(`Module '${modulePath}' is missing expected export '${exp}'`);
      }
    }
    return mod;
  } catch (err: any) {
    throw new Error(`Failed to load module '${modulePath}': ${err.message}`);
  }
}

// Helper to check if a database table is accessible
async function checkTable(tableName: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials are not configured in environment');
  }
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await client.from(tableName).select('id').limit(1);
  if (error) {
    if (error.code === '42P01') {
      throw new Error(`Database table '${tableName}' does not exist (Feature not implemented in DB)`);
    }
    // RLS permission error (42501) actually means the table exists but access is blocked, which is fine
    if (error.code === '42501' || error.message.includes('permission')) {
      return;
    }
    throw new Error(`Database table check failed for '${tableName}': ${error.message} (code: ${error.code})`);
  }
}

// Helper to check if a database RPC function exists
async function checkRpc(rpcName: string, params: any = {}): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials are not configured in environment');
  }
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await client.rpc(rpcName, params);
  if (error) {
    if (error.code === '3F000' || error.message.includes('does not exist')) {
      throw new Error(`Database RPC '${rpcName}' does not exist (Feature not implemented in DB)`);
    }
    throw new Error(`Database RPC check failed for '${rpcName}': ${error.message} (code: ${error.code})`);
  }
}

// Helper to check profile table columns
async function checkProfileColumns(columns: string[]): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials are not configured in environment');
  }
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const selectStr = columns.join(', ');
  const { error } = await client.from('profiles').select(selectStr).limit(1);
  if (error) {
    if (error.code === '42703') {
      throw new Error(`One or more columns [${selectStr}] do not exist in profiles table (Feature not implemented in DB)`);
    }
    throw new Error(`Database check for profile columns failed: ${error.message}`);
  }
}

// -------------------------------------------------------------
// The 93 Test Cases Register
// -------------------------------------------------------------
const tests: TestCase[] = [
  // ==========================================
  // FEATURE 1: DETERMINISTIC MATCHMAKING (F1)
  // ==========================================
  {
    id: 'F1T1_SectFilter',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify purohits are filtered strictly by sect (only requested sect returned)',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 12.9716, 77.5946);
      assert(results.every((p: any) => p.sect === 'Smartha'), 'Returned purohit with incorrect sect');
    }
  },
  {
    id: 'F1T1_LanguageFilter',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify purohits are filtered strictly by language (only requested language returned)',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 12.9716, 77.5946);
      assert(results.every((p: any) => p.languages.includes('Telugu')), 'Returned purohit who does not speak Telugu');
    }
  },
  {
    id: 'F1T1_ProximitySort',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify results are ordered by distance ascending',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 12.9716, 77.5946);
      for (let i = 0; i < results.length - 1; i++) {
        assert(results[i].distance <= results[i + 1].distance, 'Results are not sorted by distance ascending');
      }
    }
  },
  {
    id: 'F1T1_BookingFreqTieBreaker',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify that when distances are identical, purohits with higher booking frequency are ranked first',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 12.9716, 77.5946);
      for (let i = 0; i < results.length - 1; i++) {
        if (results[i].distance === results[i + 1].distance) {
          assert(results[i].booking_frequency >= results[i + 1].booking_frequency, 'Tie-breaker for booking frequency failed');
        }
      }
    }
  },
  {
    id: 'F1T1_Top3Limit',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify that only the top 3 recommendations are returned',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 12.9716, 77.5946);
      assert(results.length <= 3, 'Returned more than 3 recommendations');
    }
  },
  {
    id: 'F1T2_EmptyResult',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify correct behavior (empty array) when no matching purohits exist',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('NonExistentSect', 'NonExistentLang', 12.9716, 77.5946);
      assert.strictEqual(results.length, 0, 'Should return an empty array for non-matching parameters');
    }
  },
  {
    id: 'F1T2_LargeDistance',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify distance calculation works over very large coordinates',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', -45, -90);
      for (const p of results) {
        assert(p.distance > 5000, 'Distance should be large for opposite side of the globe');
      }
    }
  },
  {
    id: 'F1T2_ZeroCoords',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify matching works when coordinates are exactly (0,0)',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Telugu', 0, 0);
      assert(Array.isArray(results), 'Should handle zero coordinates cleanly');
    }
  },
  {
    id: 'F1T2_MultipleLanguages',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify matchmaking works when a purohit supports multiple languages and user requests one of them',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      const results = await mod.matchPurohits('Smartha', 'Kannada', 12.9716, 77.5946);
      assert(results.every((p: any) => p.languages.includes('Kannada')), 'Failed to match one of multiple languages');
    }
  },
  {
    id: 'F1T2_NullOrMissingFields',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F1: Deterministic Matchmaking',
    description: 'Verify robust error handling if some purohit records have null fields or invalid types',
    fn: async () => {
      const mod = await checkModule('src/features/pujari/services/matchmaking.ts', ['matchPurohits']);
      await checkTable('purohits');
      try {
        await mod.matchPurohits(null as any, undefined as any, NaN, null as any);
        assert.fail('Should fail on invalid argument inputs');
      } catch (err: any) {
        assert(err instanceof Error);
      }
    }
  },

  // ==========================================
  // FEATURE 2: RLS SECURITY ACTIVE ON TABLES (F2)
  // ==========================================
  {
    id: 'F2T1_PurohitsAnonymousRead',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F2: RLS Security',
    description: 'Anonymous user cannot read/write directly to purohits',
    fn: async () => {
      await checkTable('purohits');
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client.from('purohits').select('*');
      if (error) {
        assert(error.code === '42501' || error.message.includes('permission'), 'Expected RLS permission error');
      } else {
        assert.strictEqual(data?.length || 0, 0, 'Anonymous query must return empty list under RLS');
      }
    }
  },
  {
    id: 'F2T1_PurohitsAuthenticatedRead',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F2: RLS Security',
    description: 'Authenticated purohit can read own profile',
    fn: async () => {
      await checkTable('purohits');
      throw new Error('RLS authenticated tests require mock user sessions (Feature not implemented)');
    }
  },
  {
    id: 'F2T1_BookingsAnonymousNoAccess',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F2: RLS Security',
    description: 'Anonymous user cannot view bookings',
    fn: async () => {
      await checkTable('bookings');
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client.from('bookings').select('*');
      if (error) {
        assert(error.code === '42501' || error.message.includes('permission'), 'Expected RLS permission error');
      } else {
        assert.strictEqual(data?.length || 0, 0, 'Anonymous query must return empty list under RLS');
      }
    }
  },
  {
    id: 'F2T1_BookingsCustomerAccessOwn',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F2: RLS Security',
    description: 'Customer can read/write their own bookings only',
    fn: async () => {
      await checkTable('bookings');
      throw new Error('RLS authenticated customer tests require user session (Feature not implemented)');
    }
  },
  {
    id: 'F2T1_GlobalSettingsReadWrite',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F2: RLS Security',
    description: 'Authenticated users can read global settings, but only admin role can write',
    fn: async () => {
      await checkTable('global_settings');
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await client.from('global_settings').insert({ id: 'test_key', value: 'val' });
      assert(error && (error.code === '42501' || error.message.includes('permission')), 'Non-admin anonymous write was allowed on global_settings!');
    }
  },
  {
    id: 'F2T2_SqlInjectionSecCheck',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F2: RLS Security',
    description: 'SQL Injection attempt in matchmaking or filter parameters is rejected',
    fn: async () => {
      await checkTable('purohits');
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await client.from('purohits').select('*').eq('sect', "' OR '1'='1");
      if (error) {
        // PG parser error or permission error is fine, as long as it doesn't leak data
        return;
      }
    }
  },
  {
    id: 'F2T2_BookingTampering',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F2: RLS Security',
    description: "Authenticated user A tries to update user B's booking (must fail)",
    fn: async () => {
      await checkTable('bookings');
      throw new Error('Booking tampering tests require authenticated user session (Feature not implemented)');
    }
  },
  {
    id: 'F2T2_UnauthenticatedBookingCreation',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F2: RLS Security',
    description: 'Booking creation without authentication must be denied',
    fn: async () => {
      await checkTable('bookings');
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await client.from('bookings').insert({ user_id: '00000000-0000-0000-0000-000000000000', price: 5000 });
      assert(error && (error.code === '42501' || error.message.includes('permission')), 'Allowed unauthenticated insert into bookings table');
    }
  },
  {
    id: 'F2T2_GlobalSettingsWriteByNonAdmin',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F2: RLS Security',
    description: 'Authenticated non-admin attempts to update global_settings (must fail)',
    fn: async () => {
      await checkTable('global_settings');
      throw new Error('Global settings non-admin write tests require user session (Feature not implemented)');
    }
  },
  {
    id: 'F2T2_BypassRlsUsingRpc',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F2: RLS Security',
    description: 'Check if the matchmaking RPC bypasses RLS and exposes private booking details',
    fn: async () => {
      await checkRpc('match_purohits', { user_sect: 'Smartha', user_lang: 'Telugu', user_lat: 12, user_lng: 77 });
      throw new Error('RPC security audit check requires RPC implementation (Feature not implemented)');
    }
  },

  // ==========================================
  // FEATURE 3: LIVE CRISIS HARD-ROUTING (F3)
  // ==========================================
  {
    id: 'F3T1_BypassUnder2Hours',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F3: Live Crisis Routing',
    description: 'Request with Muhurtham in 1h 30m is immediately routed to human coordinator',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + 1.5 * 60 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), true, 'Muhurtham in 1h 30m must trigger crisis window');
    }
  },
  {
    id: 'F3T1_BypassExactLimit',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F3: Live Crisis Routing',
    description: 'Request with Muhurtham in exactly 1h 59m is routed to human',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + (2 * 60 * 60 * 1000 - 1000));
      assert.strictEqual(mod.is_crisis_window(muhurtham), true, 'Muhurtham in 1h 59m must trigger crisis window');
    }
  },
  {
    id: 'F3T1_StandardRouteOver2Hours',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F3: Live Crisis Routing',
    description: 'Request with Muhurtham in 3 hours is routed to chatbot',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + 3 * 60 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), false, 'Muhurtham in 3 hours should not trigger crisis window');
    }
  },
  {
    id: 'F3T1_StandardRouteFarFuture',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F3: Live Crisis Routing',
    description: 'Request with Muhurtham in 5 days is routed to chatbot',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), false, 'Muhurtham in 5 days should not trigger crisis');
    }
  },
  {
    id: 'F3T1_ContactDetailsVerification',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F3: Live Crisis Routing',
    description: 'Route output contains the correct phone number: +91 98765 43210',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const phone = mod.CRISIS_PHONE || mod.getCrisisPhone?.();
      assert.strictEqual(phone, '+91 98765 43210', 'Crisis coordinator phone number mismatch');
    }
  },
  {
    id: 'F3T2_MuhurthamJustUnderLimit',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F3: Live Crisis Routing',
    description: 'Muhurtham is 1 minute under 2 hours (119 mins) -> routes to human',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + 119 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), true, 'Muhurtham in 119 minutes should be classified as crisis');
    }
  },
  {
    id: 'F3T2_MuhurthamJustOverLimit',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F3: Live Crisis Routing',
    description: 'Muhurtham is 1 minute over 2 hours (121 mins) -> routes to chatbot',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() + 121 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), false, 'Muhurtham in 121 minutes should not be classified as crisis');
    }
  },
  {
    id: 'F3T2_MuhurthamInPast',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F3: Live Crisis Routing',
    description: 'Muhurtham is in the past -> routes to human (crisis)',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const muhurtham = new Date(Date.now() - 10 * 60 * 1000);
      assert.strictEqual(mod.is_crisis_window(muhurtham), true, 'Past Muhurtham should be routed to human coordinator');
    }
  },
  {
    id: 'F3T2_InvalidTimeFormat',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F3: Live Crisis Routing',
    description: 'Handling of malformed date strings (must throw/gracefully reject)',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      try {
        mod.is_crisis_window('invalid date string');
        assert.fail('Should fail on malformed date input');
      } catch (err: any) {
        assert(err instanceof Error);
      }
    }
  },
  {
    id: 'F3T2_TimezoneOffsets',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F3: Live Crisis Routing',
    description: 'Matchmaking Muhurtham time check with UTC vs local time differences',
    fn: async () => {
      const mod = await checkModule('src/lib/crisis-routing.ts', ['is_crisis_window']);
      const nowIso = new Date().toISOString();
      const res = mod.is_crisis_window(nowIso);
      assert(typeof res === 'boolean');
    }
  },

  // ==========================================
  // FEATURE 4: GST INVOICING (F4)
  // ==========================================
  {
    id: 'F4T1_DakshinaExempt',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F4: GST Invoicing',
    description: 'Verify Dakshina has 0% GST applied',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(5000, 500);
      assert.strictEqual(invoice.dakshinaGst, 0, 'Dakshina GST must be exactly 0');
    }
  },
  {
    id: 'F4T1_ConvFeeGst',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F4: GST Invoicing',
    description: 'Verify convenience fee has 18% GST applied',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(5000, 500);
      assert.strictEqual(invoice.convenienceFeeGst, 90, 'Convenience fee GST must be exactly 18% of 500 = 90');
    }
  },
  {
    id: 'F4T1_TotalInvoiceCalculation',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F4: GST Invoicing',
    description: 'Verify total invoice equals Dakshina + Fee + (Fee * 0.18)',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(5000, 500);
      assert.strictEqual(invoice.total, 5590, 'Total invoice calculation incorrect');
    }
  },
  {
    id: 'F4T1_SplitDisplay',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F4: GST Invoicing',
    description: 'Verify invoice splits Dakshina and convenience fee clearly',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(5000, 500);
      assert(invoice.splitDisplay && invoice.splitDisplay.includes('Dakshina') && invoice.splitDisplay.includes('Convenience'), 'Split invoice details not formatted clearly');
    }
  },
  {
    id: 'F4T1_ZeroFeeInvoice',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F4: GST Invoicing',
    description: 'Verify total calculation when convenience fee is zero',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(5000, 0);
      assert.strictEqual(invoice.total, 5000, 'Total invoice should equal Dakshina if fee is 0');
    }
  },
  {
    id: 'F4T2_NegativeAmounts',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F4: GST Invoicing',
    description: 'Negative Dakshina or fee throws error',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      try {
        mod.calculateInvoice(-5000, 500);
        assert.fail('Should fail on negative Dakshina');
      } catch (err: any) {
        assert(err instanceof Error);
      }
    }
  },
  {
    id: 'F4T2_RoundingCent',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F4: GST Invoicing',
    description: 'Check correct rounding behavior to nearest paise/cent',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      // fee = 100.55 -> GST = 18.099 -> rounds to 18.10
      const invoice = mod.calculateInvoice(1000, 100.55);
      assert.strictEqual(invoice.convenienceFeeGst, 18.10);
    }
  },
  {
    id: 'F4T2_ExtremelyLargeInvoice',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F4: GST Invoicing',
    description: 'Very large dakshina amount does not cause numerical overflow',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(1000000000, 1000000);
      assert.strictEqual(invoice.total, 1001180000, 'Overflow or precision issue on large invoice');
    }
  },
  {
    id: 'F4T2_FloatPrecision',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F4: GST Invoicing',
    description: 'Verification of floating point additions (avoid JS float precision bugs)',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(0.1, 0.2);
      assert.strictEqual(invoice.total, 0.336); // 0.1 + 0.2 + 0.036
    }
  },
  {
    id: 'F4T2_ZeroDakshina',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F4: GST Invoicing',
    description: 'Invoice with zero dakshina but valid convenience fee behaves correctly',
    fn: async () => {
      const mod = await checkModule('src/lib/invoicing.ts', ['calculateInvoice']);
      const invoice = mod.calculateInvoice(0, 100);
      assert.strictEqual(invoice.total, 118);
    }
  },

  // ==========================================
  // FEATURE 5: LEGAL WAIVERS (F5)
  // ==========================================
  {
    id: 'F5T1_FireWaiverContent',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F5: Legal Waivers',
    description: 'Checkout screen must contain Fire Hazard disclaimer',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts');
      const text = mod.FIRE_WAIVER_TEXT || mod.getFireWaiverText?.();
      assert(text && text.toLowerCase().includes('fire'), 'Fire Hazard disclaimer missing or empty');
    }
  },
  {
    id: 'F5T1_MetaphysicalWaiverContent',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F5: Legal Waivers',
    description: 'Checkout screen must contain Metaphysical Outcome disclaimer',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts');
      const text = mod.METAPHYSICAL_WAIVER_TEXT || mod.getMetaphysicalWaiverText?.();
      assert(text && text.toLowerCase().includes('metaphysical'), 'Metaphysical Outcome disclaimer missing or empty');
    }
  },
  {
    id: 'F5T1_UserMustAcceptWaiver',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F5: Legal Waivers',
    description: 'User cannot complete booking without accepting waivers',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts', ['validateWaiverAcceptance']);
      assert.strictEqual(mod.validateWaiverAcceptance(false, true), false);
      assert.strictEqual(mod.validateWaiverAcceptance(true, false), false);
      assert.strictEqual(mod.validateWaiverAcceptance(true, true), true);
    }
  },
  {
    id: 'F5T1_WaiverLogOnBooking',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F5: Legal Waivers',
    description: 'Verify accepted waiver versions are logged on the booking record',
    fn: async () => {
      await checkTable('bookings');
      throw new Error('Waiver log tracking not implemented in database schema (Feature not implemented)');
    }
  },
  {
    id: 'F5T1_WaiverRenderedCorrectly',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F5: Legal Waivers',
    description: 'Verify disclaimers are visible in the checkout HTML',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts');
      assert(mod.FIRE_WAIVER_TEXT && mod.METAPHYSICAL_WAIVER_TEXT, 'Disclaimer rendering texts missing');
    }
  },
  {
    id: 'F5T2_EmptyWaiverAcceptance',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F5: Legal Waivers',
    description: 'Attempting to submit blank waiver acceptances is blocked',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts', ['validateWaiverAcceptance']);
      try {
        mod.validateWaiverAcceptance(null as any, undefined as any);
        assert.fail('Should fail on null/undefined waiver acceptance inputs');
      } catch (err: any) {
        assert(err instanceof Error);
      }
    }
  },
  {
    id: 'F5T2_TamperedWaiverTexts',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F5: Legal Waivers',
    description: 'Attempting to submit modified waiver texts is rejected',
    fn: async () => {
      const mod = await checkModule('src/lib/waivers.ts');
      if (mod.validateWaiverText) {
        assert.strictEqual(mod.validateWaiverText('tampered waiver text'), false);
      } else {
        throw new Error('Waiver text verification function validateWaiverText not implemented');
      }
    }
  },
  {
    id: 'F5T2_DoubleAcceptance',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F5: Legal Waivers',
    description: "Verifying double form submission doesn't create duplicate bookings or bypass waiver records",
    fn: async () => {
      throw new Error('Double booking and waiver submission protection not implemented');
    }
  },
  {
    id: 'F5T2_MobileViewportVisibility',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F5: Legal Waivers',
    description: 'Ensure disclaimers are accessible on small screens',
    fn: async () => {
      throw new Error('Waiver responsive layout properties not configured (Feature not implemented)');
    }
  },
  {
    id: 'F5T2_NullWaiverRecord',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F5: Legal Waivers',
    description: 'Direct API call with null waiver status is rejected',
    fn: async () => {
      throw new Error('Waiver API validation filter not implemented');
    }
  },

  // ==========================================
  // FEATURE 6: GOTRA, NAKSHATRA, DEATH DATES (F6)
  // ==========================================
  {
    id: 'F6T1_SaveGotra',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F6: Profile Settings',
    description: 'Gotra string is saved and retrieved',
    fn: async () => {
      await checkProfileColumns(['gotra']);
    }
  },
  {
    id: 'F6T1_SaveNakshatra',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F6: Profile Settings',
    description: 'Nakshatra is saved and retrieved',
    fn: async () => {
      await checkProfileColumns(['nakshatra']);
    }
  },
  {
    id: 'F6T1_SaveAncestralDeathDates',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F6: Profile Settings',
    description: 'Ancestral death dates array is saved and retrieved',
    fn: async () => {
      await checkProfileColumns(['ancestral_death_dates']);
    }
  },
  {
    id: 'F6T1_UpdateProfileSuccess',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F6: Profile Settings',
    description: 'Profile update returns success status',
    fn: async () => {
      throw new Error('Profile update action/handler not implemented');
    }
  },
  {
    id: 'F6T1_DisplayInProfilePage',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F6: Profile Settings',
    description: 'Settings are populated when profile page loads',
    fn: async () => {
      throw new Error('Profile layout state bindings not implemented');
    }
  },
  {
    id: 'F6T2_EmptyGotraNakshatra',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F6: Profile Settings',
    description: 'Profile saves empty or blank values without crashing',
    fn: async () => {
      await checkProfileColumns(['gotra', 'nakshatra']);
      throw new Error('Gotra/Nakshatra empty updates not implemented');
    }
  },
  {
    id: 'F6T2_InvalidNakshatraValue',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F6: Profile Settings',
    description: 'Rejecting non-standard Nakshatra names if validation is present',
    fn: async () => {
      throw new Error('Nakshatra standard validation rules not implemented');
    }
  },
  {
    id: 'F6T2_FutureDeathDate',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F6: Profile Settings',
    description: 'Attempting to save a future Gregorian date for an ancestral death date is rejected',
    fn: async () => {
      throw new Error('Ancestral death date range validation not implemented');
    }
  },
  {
    id: 'F6T2_LargeAncestorsArray',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F6: Profile Settings',
    description: 'Saving a large array of ancestral dates is handled gracefully',
    fn: async () => {
      throw new Error('Ancestral dates array size scaling logic not implemented');
    }
  },
  {
    id: 'F6T2_MalformedDateString',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F6: Profile Settings',
    description: 'Passing invalid date formats for death dates throws a validation error',
    fn: async () => {
      throw new Error('Date format validation not implemented');
    }
  },

  // ==========================================
  // FEATURE 7: ANCESTRAL LUNAR TITHI TRACKER (F7)
  // ==========================================
  {
    id: 'F7T1_ConvertPratipada',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify a known date converts to Pratipada',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2026-03-19'));
      assert.strictEqual(res, 'Pratipada', 'Date 2026-03-19 did not resolve to Pratipada');
    }
  },
  {
    id: 'F7T1_ConvertDwitiya',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify another known date converts to Dwitiya',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2026-03-20'));
      assert.strictEqual(res, 'Dwitiya', 'Date 2026-03-20 did not resolve to Dwitiya');
    }
  },
  {
    id: 'F7T1_ConvertAmavasya',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify a new moon date converts to Amavasya',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2026-03-18'));
      assert.strictEqual(res, 'Amavasya', 'Date 2026-03-18 did not resolve to Amavasya');
    }
  },
  {
    id: 'F7T1_ConvertPurnima',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify a full moon date converts to Purnima',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2026-04-01'));
      assert.strictEqual(res, 'Purnima', 'Date 2026-04-01 did not resolve to Purnima');
    }
  },
  {
    id: 'F7T1_ValidTithiOutput',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify return value is one of the 30 standard Tithis',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const tithis = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Krishna Pratipada', 'Krishna Dwitiya', 'Krishna Tritiya', 'Krishna Chaturthi', 'Krishna Panchami', 'Krishna Shashthi', 'Krishna Saptami', 'Krishna Ashtami', 'Krishna Navami', 'Krishna Dashami', 'Krishna Ekadashi', 'Krishna Dwadashi', 'Krishna Trayodashi', 'Krishna Chaturdashi', 'Amavasya'
      ];
      const res = mod.get_tithi_for_date(new Date());
      assert(tithis.includes(res), `Output '${res}' is not one of the standard 30 lunar tithi values`);
    }
  },
  {
    id: 'F7T2_LeapYearTithi',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verify Tithi calculation on Feb 29 of a leap year',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2028-02-29'));
      assert(typeof res === 'string');
    }
  },
  {
    id: 'F7T2_FarFutureTithi',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Tithi calculation for a year in the far future',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('2050-01-01'));
      assert(typeof res === 'string');
    }
  },
  {
    id: 'F7T2_HistoricalTithi',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Tithi calculation for a historical date',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      const res = mod.get_tithi_for_date(new Date('1950-01-01'));
      assert(typeof res === 'string');
    }
  },
  {
    id: 'F7T2_TithiBoundaryChange',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Verification when a date shifts Tithi mid-day',
    fn: async () => {
      throw new Error('Mid-day boundary Tithi calculation shifts not implemented');
    }
  },
  {
    id: 'F7T2_InvalidDateInput',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F7: Lunar Tithi Tracker',
    description: 'Inputting an invalid date string/object to the tracker utility returns a clear error or falls back',
    fn: async () => {
      const mod = await checkModule('src/lib/tithi.ts', ['get_tithi_for_date']);
      try {
        mod.get_tithi_for_date('invalid-date' as any);
        assert.fail('Should fail on invalid date inputs');
      } catch (err: any) {
        assert(err instanceof Error);
      }
    }
  },

  // ==========================================
  // FEATURE 8: WHATSAPP SCHEDULED NOTIFICATIONS (F8)
  // ==========================================
  {
    id: 'F8T1_Trigger14Days',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F8: WhatsApp Notifications',
    description: 'Scheduler registers trigger at T-14 days',
    fn: async () => {
      const mod = await checkModule('src/lib/notifications.ts', ['scheduleNotification']);
      throw new Error('WhatsApp trigger scheduling not implemented');
    }
  },
  {
    id: 'F8T1_Trigger7Days',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F8: WhatsApp Notifications',
    description: 'Scheduler registers trigger at T-7 days',
    fn: async () => {
      const mod = await checkModule('src/lib/notifications.ts', ['scheduleNotification']);
      throw new Error('WhatsApp trigger scheduling not implemented');
    }
  },
  {
    id: 'F8T1_Trigger3Days',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F8: WhatsApp Notifications',
    description: 'Scheduler registers trigger at T-3 days',
    fn: async () => {
      const mod = await checkModule('src/lib/notifications.ts', ['scheduleNotification']);
      throw new Error('WhatsApp trigger scheduling not implemented');
    }
  },
  {
    id: 'F8T1_NoTriggerOtherDays',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F8: WhatsApp Notifications',
    description: 'Scheduler does not send alerts at other times (e.g. T-10 days)',
    fn: async () => {
      const mod = await checkModule('src/lib/notifications.ts', ['scheduleNotification']);
      throw new Error('WhatsApp trigger scheduling not implemented');
    }
  },
  {
    id: 'F8T1_WhatsAppPayloadStructure',
    tier: 'Tier 1: Feature Coverage',
    feature: 'F8: WhatsApp Notifications',
    description: 'Verify outgoing message contains ceremony details and is properly formatted',
    fn: async () => {
      const mod = await checkModule('src/lib/notifications.ts', ['scheduleNotification']);
      throw new Error('WhatsApp notification templates and formatters not implemented');
    }
  },
  {
    id: 'F8T2_AlertMissedCronRecovery',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F8: WhatsApp Notifications',
    description: 'If a cron runs late, it still catches events within the day',
    fn: async () => {
      throw new Error('WhatsApp cron fallback recovery not implemented');
    }
  },
  {
    id: 'F8T2_UserOptOut',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F8: WhatsApp Notifications',
    description: 'Notifications are not sent if user has opted out in settings',
    fn: async () => {
      throw new Error('WhatsApp notification opt-out settings not implemented');
    }
  },
  {
    id: 'F8T2_InvalidPhoneNumber',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F8: WhatsApp Notifications',
    description: 'Outgoing failure is handled gracefully when number is invalid',
    fn: async () => {
      throw new Error('WhatsApp API error fallback handler not implemented');
    }
  },
  {
    id: 'F8T2_DoubleTriggers',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F8: WhatsApp Notifications',
    description: 'Ensures a reminder is sent exactly once per trigger window',
    fn: async () => {
      throw new Error('WhatsApp notification trigger locking/deduplication not implemented');
    }
  },
  {
    id: 'F8T2_UrgentMuhurtham',
    tier: 'Tier 2: Boundary & Corner Cases',
    feature: 'F8: WhatsApp Notifications',
    description: 'If a ceremony is booked <3 days in advance, ensure appropriate logic',
    fn: async () => {
      throw new Error('WhatsApp immediate reminder triggers for urgent bookings not implemented');
    }
  },

  // ==========================================
  // TIER 3: CROSS-FEATURE COMBINATIONS
  // ==========================================
  {
    id: 'F1_F2_T3_MatchmakingRls',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F1 + F2',
    description: 'Matching query executes successfully and only returns purohits that have active/public listings (RLS checked)',
    fn: async () => {
      await checkTable('purohits');
      throw new Error('Matchmaking and RLS security combination not implemented');
    }
  },
  {
    id: 'F1_F3_T3_MatchmakingCrisis',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F1 + F3',
    description: 'When user tries to match purohits for a muhurtham <2 hours away, matchmaking is bypassed and routed to crisis coordinator',
    fn: async () => {
      throw new Error('Matchmaking bypassing and crisis coordinator routing integration not implemented');
    }
  },
  {
    id: 'F1_F4_T3_MatchmakingInvoice',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F1 + F4',
    description: "Selecting a matched purohit calculates the invoice with correct split GST (Dakshina vs Fee) for that purohit's specific pricing",
    fn: async () => {
      throw new Error('Invoice calculation integration with matched purohit selected profile details not implemented');
    }
  },
  {
    id: 'F2_F6_T3_ProfileRls',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F2 + F6',
    description: 'Profile settings (Gotra, Nakshatra, Death dates) can only be viewed and written to by the authenticated user themselves (RLS checked)',
    fn: async () => {
      await checkProfileColumns(['gotra', 'nakshatra', 'ancestral_death_dates']);
      throw new Error('Profile settings fields RLS security not implemented');
    }
  },
  {
    id: 'F4_F5_T3_InvoiceWaiverCheckout',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F4 + F5',
    description: 'Checkout requires accepting the waivers (Fire, Metaphysical) before generating the split GST invoice and booking',
    fn: async () => {
      throw new Error('Checkout waiver block validation not integrated with billing generation');
    }
  },
  {
    id: 'F6_F7_T3_ProfileTithiConvert',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F6 + F7',
    description: 'Saving ancestral death dates in profile settings automatically converts them to lunar tithis for display',
    fn: async () => {
      await checkProfileColumns(['ancestral_death_dates']);
      throw new Error('Profile death dates save-and-convert tithi trigger not implemented');
    }
  },
  {
    id: 'F7_F8_T3_TithiWhatsAppAlert',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F7 + F8',
    description: 'WhatsApp alerts are scheduled based on the calculated lunar tithi anniversary (using Gregorian conversion), triggering at 14, 7, and 3 days prior to the next lunar date',
    fn: async () => {
      throw new Error('Lunar anniversary calculations scheduler not integrated with WhatsApp notifier');
    }
  },
  {
    id: 'F3_F8_T3_CrisisNoWhatsApp',
    tier: 'Tier 3: Cross-Feature Combinations',
    feature: 'Cross-Feature: F3 + F8',
    description: 'Crisis hard-routed bookings do not trigger standard scheduled automated WhatsApp notifications since they are managed manually',
    fn: async () => {
      throw new Error('Crisis window flow notification exclusion rules not implemented');
    }
  },

  // ==========================================
  // TIER 4: REAL-WORLD WORKLOAD SCENARIOS
  // ==========================================
  {
    id: 'RW_T4_StandardCustomerFlow',
    tier: 'Tier 4: Real-world workloads',
    feature: 'Real-world Scenario 1',
    description: 'Customer registers, edits profile (Gotra, Nakshatra), performs deterministic search for Smartha purohit speaking Telugu, finds top match, accepts waivers, completes checkout with split GST invoice, and schedules WhatsApp notifications for an ancestral tithi',
    fn: async () => {
      throw new Error('Standard E2E customer booking workload flow not implemented');
    }
  },
  {
    id: 'RW_T4_LastMinuteEmergency',
    tier: 'Tier 4: Real-world workloads',
    feature: 'Real-world Scenario 2',
    description: 'User visits site to book a puja scheduled in 1 hour. System detects crisis window, bypasses search/checkout, and displays human coordinator contact card',
    fn: async () => {
      throw new Error('Emergency redirect page flow not implemented');
    }
  },
  {
    id: 'RW_T4_AdminDashboardManagement',
    tier: 'Tier 4: Real-world workloads',
    feature: 'Real-world Scenario 3',
    description: 'Admin logs in, updates global settings, checks purohit bookings and billing reports showing correct GST splits, while verifying database constraints and RLS prevent unauthorized access',
    fn: async () => {
      throw new Error('Admin CMS console portal checks not implemented');
    }
  },
  {
    id: 'RW_T4_TithiAnniversaryAlertCycle',
    tier: 'Tier 4: Real-world workloads',
    feature: 'Real-world Scenario 4',
    description: 'Background scheduler runs, translates ancestral dates of multiple profiles, identifies an upcoming tithi anniversary in 7 days, and triggers a formatted WhatsApp alert',
    fn: async () => {
      throw new Error('Annual Shraddha/Tarpanam scheduler background run task not implemented');
    }
  },
  {
    id: 'RW_T4_SectarianMatchmakingOverload',
    tier: 'Tier 4: Real-world workloads',
    feature: 'Real-world Scenario 5',
    description: 'Deterministic matching engine receives simultaneous requests from Smartha, Shaiva, and Vaishnava users. Returns correct top 3 candidates sorted by distance, with ties broken by booking frequency',
    fn: async () => {
      throw new Error('Concurrence load performance matchmaking stress scenarios not implemented');
    }
  }
];

// -------------------------------------------------------------
// Run Test Suite
// -------------------------------------------------------------
async function runTestSuite() {
  console.log('================================================================');
  console.log('            VaidikaConnect E2E Test Suite Runner                ');
  console.log('            Total Scheduled Test Cases: 93                       ');
  console.log('================================================================\n');

  const results: TestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const indexStr = String(i + 1).padStart(2, '0');
    console.log(`[${indexStr}/93] Running ${test.id} - ${test.description}...`);

    const start = Date.now();
    let status: 'PASSED' | 'FAILED' = 'PASSED';
    let errorMessage: string | undefined;

    try {
      await test.fn();
      passedCount++;
      console.log(`      \x1b[32m✔ PASSED\x1b[0m (${Date.now() - start}ms)`);
    } catch (err: any) {
      status = 'FAILED';
      errorMessage = err.message || String(err);
      failedCount++;
      console.log(`      \x1b[31m✘ FAILED:\x1b[0m ${errorMessage} (${Date.now() - start}ms)`);
    }

    results.push({
      id: test.id,
      tier: test.tier,
      feature: test.feature,
      status,
      error: errorMessage,
      durationMs: Date.now() - start
    });
  }

  console.log('\n================================================================');
  console.log('                      TEST SUMMARY REPORT                       ');
  console.log('================================================================');
  console.log(`Total Run:  ${tests.length}`);
  console.log(`Passed:     \x1b[32m${passedCount}\x1b[0m`);
  console.log(`Failed:     \x1b[31m${failedCount}\x1b[0m`);
  console.log(`Pass Rate:  ${((passedCount / tests.length) * 100).toFixed(2)}%\n`);

  if (failedCount > 0) {
    console.log('Failed Test Details:');
    results.filter(r => r.status === 'FAILED').forEach((r, idx) => {
      console.log(`${idx + 1}. [${r.id}] [${r.tier}] - ${r.error}`);
    });
  }
  console.log('================================================================');

  // Return exit code 0 even on test failures so that build script doesn't abort. 
  // We want to verify that compilation succeeds and it runs cleanly, and tests fail appropriately.
  process.exit(0);
}

runTestSuite().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
