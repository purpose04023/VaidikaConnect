import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function run() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials!');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('\n--- Fetching All Programs ---');
  const { data: programs, error: progErr } = await supabase.from('programs').select('id, title, title_te, image_url');
  if (progErr) {
    console.error('Error fetching programs:', progErr);
  } else {
    console.log(`Found ${programs?.length} programs:`);
    for (const prog of programs || []) {
      console.log(`- ${prog.title} (Telugu: ${prog.title_te}) -> ${prog.image_url}`);
    }
  }
}

run().catch(console.error);
