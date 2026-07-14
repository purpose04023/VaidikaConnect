import { createClient } from '@supabase/supabase-js';

/**
 * Matches purohits based on sect, language, and geographic proximity.
 * Input validation is performed at the boundary before calling the DB.
 */
export async function matchPurohits(
  user_sect: string,
  user_lang: string,
  user_lat: number,
  user_lng: number
): Promise<any[]> {
  // Input validation
  if (!user_sect || typeof user_sect !== 'string') {
    throw new Error('Invalid user_sect: Must be a non-empty string');
  }
  if (!user_lang || typeof user_lang !== 'string') {
    throw new Error('Invalid user_lang: Must be a non-empty string');
  }
  if (user_lat === undefined || user_lat === null || isNaN(user_lat)) {
    throw new Error('Invalid user_lat: Must be a valid number');
  }
  if (user_lng === undefined || user_lng === null || isNaN(user_lng)) {
    throw new Error('Invalid user_lng: Must be a valid number');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createClient(url, key);
  const { data, error } = await supabase.rpc('match_purohits', {
    user_sect,
    user_lang,
    user_lat,
    user_lng,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
