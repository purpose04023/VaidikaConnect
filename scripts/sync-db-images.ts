import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Import local data sources
import { defaultTemples } from '../src/lib/data/temples';
import { defaultPujas } from '../src/lib/data';
import { stotramsData } from '../src/lib/data/stotrams';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const SPECIAL_MAPPINGS: Record<string, string> = {
  "garbadanam": "/images/poojas/puja-garbhadanam.svg",
  "annaprasanamu": "/images/poojas/puja-annaprasana.svg",
  "Choulakarma": "/images/poojas/puja-chudakarma.svg",
  "karnabeda": "/images/poojas/puja-karna-vedha.svg",
  "Upaakarma": "/images/poojas/puja-upakarma.svg",
  "aksharabyasam": "/images/poojas/puja-aksharabyasam.svg",
  "kasiyatra": "/images/poojas/puja-kasiyatra.svg",
  "eduru sannahslu": "/images/poojas/puja-edurusannahalu.svg",
  "Punasandanamu": "/images/poojas/puja-punasandanamu.svg",
  "Nityagni hotram": "/images/poojas/puja-nityagnihotram.svg",
  "Sastipurti": "/images/poojas/puja-sastipurti.svg"
};

function cleanText(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials!');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('🚀 Supabase client initialized. URL:', SUPABASE_URL);

  // 1. SYNC TEMPLES
  console.log('\n--- Syncing Temples ---');
  let templesUpdated = 0;
  for (const temple of defaultTemples) {
    const localImg = `/images/temples/${temple.id}.png`;
    console.log(`Syncing temple "${temple.name}" (ID: ${temple.id}) -> image: ${localImg}`);
    
    const { data, error } = await supabase
      .from('temples')
      .update({
        image: localImg,
        banner_image: localImg
      })
      .eq('id', temple.id)
      .select('id, name');

    if (error) {
      console.error(`❌ Failed to update temple ${temple.id}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Successfully updated temple: ${data[0].name}`);
      templesUpdated++;
    } else {
      console.warn(`⚠️ Temple ID ${temple.id} not found in database.`);
    }
  }
  console.log(`🎉 Finished Temples Sync: ${templesUpdated}/${defaultTemples.length} updated.`);

  // 2. SYNC PROGRAMS (PUJAS)
  console.log('\n--- Syncing Programs (Pujas) ---');
  const { data: dbPrograms, error: progFetchErr } = await supabase.from('programs').select('*');
  if (progFetchErr) {
    console.error('❌ Failed to fetch programs from database:', progFetchErr.message);
    return;
  }

  console.log(`Found ${dbPrograms?.length} programs in remote database.`);
  let programsUpdated = 0;

  for (const dbProg of (dbPrograms || [])) {
    let localImg = '';
    let localHint = '';

    // Check special manual mappings first
    if (SPECIAL_MAPPINGS[dbProg.title]) {
      localImg = SPECIAL_MAPPINGS[dbProg.title];
      localHint = `SVG illustration of ${dbProg.title}`;
    } else {
      // Try to find the matching local puja definition
      const matchedPuja = defaultPujas.find(p => {
        if (p.name_en === dbProg.title) return true;
        if (p.name === dbProg.title_te) return true;
        if (cleanText(p.name_en) === cleanText(dbProg.title)) return true;
        
        const cleanPName = cleanText(p.name_en).replace(/vratam|nomu|homam|puja|wedding/g, '');
        const cleanDBName = cleanText(dbProg.title).replace(/vratam|nomu|homam|puja|wedding/g, '');
        if (cleanPName && cleanPName === cleanDBName) return true;
        
        return false;
      });

      if (matchedPuja) {
        localImg = matchedPuja.image;
        localHint = matchedPuja.imageHint;
      }
    }

    if (localImg) {
      console.log(`Matched DB Program "${dbProg.title}" -> image: ${localImg}`);
      const { data, error } = await supabase
        .from('programs')
        .update({
          image_url: localImg,
          image_hint: localHint || `SVG illustration of ${dbProg.title}`
        })
        .eq('id', dbProg.id)
        .select('id, title');

      if (error) {
        console.error(`❌ Failed to update program "${dbProg.title}":`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Successfully updated program image to: ${localImg}`);
        programsUpdated++;
      }
    } else {
      console.warn(`⚠️ Could not find a local match for DB Program: "${dbProg.title}" (Telugu: "${dbProg.title_te}")`);
    }
  }
  console.log(`🎉 Finished Programs Sync: ${programsUpdated}/${dbPrograms?.length || 0} updated.`);

  console.log('\n✨ Database sync script completed! ✨');
}

run().catch(console.error);
