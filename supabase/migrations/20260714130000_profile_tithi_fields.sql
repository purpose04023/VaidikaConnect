-- Add ancestral identity columns to user profiles.
-- Gotra and Nakshatra are needed for Purohit matching.
-- ancestral_death_date powers the annual Shraddha/Tarpanam Tithi tracker.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gotra TEXT,
  ADD COLUMN IF NOT EXISTS nakshatra TEXT,
  ADD COLUMN IF NOT EXISTS ancestral_death_date DATE,
  ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;

COMMENT ON COLUMN public.profiles.gotra IS 'Family lineage identifier (e.g. Bharadwaja, Kashyapa)';
COMMENT ON COLUMN public.profiles.nakshatra IS 'Birth star (e.g. Rohini, Ashwini)';
COMMENT ON COLUMN public.profiles.ancestral_death_date IS 'Gregorian date of ancestor death for annual Shraddha Tithi reminders';
COMMENT ON COLUMN public.profiles.whatsapp_phone IS 'WhatsApp-capable mobile number for ceremony reminders (E.164 format)';
