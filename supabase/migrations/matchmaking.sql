-- Create public.purohits table
CREATE TABLE IF NOT EXISTS public.purohits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sect TEXT NOT NULL CHECK (sect IN ('Smartha', 'Vaishnava', 'Shaiva')),
    languages TEXT[] NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    booking_frequency INTEGER DEFAULT 0 NOT NULL
);

-- Create public.bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purohit_id UUID NOT NULL REFERENCES public.purohits(id) ON DELETE CASCADE,
    muhurtham_time TIMESTAMP WITH TIME ZONE NOT NULL,
    dakshina NUMERIC(10,2) NOT NULL,
    convenience_fee NUMERIC(10,2) NOT NULL,
    gst_amount NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    price NUMERIC(10,2) NULL, -- Supports legacy test fields
    fire_hazard_accepted BOOLEAN NOT NULL DEFAULT false,
    metaphysical_disclaimer_accepted BOOLEAN NOT NULL DEFAULT false,
    waiver_version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.purohits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- Configure RLS policies for public.purohits
DROP POLICY IF EXISTS "Allow authenticated read on purohits" ON public.purohits;
CREATE POLICY "Allow authenticated read on purohits" ON public.purohits
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow user insert own purohit profile" ON public.purohits;
CREATE POLICY "Allow user insert own purohit profile" ON public.purohits
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow user update own purohit profile" ON public.purohits;
CREATE POLICY "Allow user update own purohit profile" ON public.purohits
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow admin full access on purohits" ON public.purohits;
CREATE POLICY "Allow admin full access on purohits" ON public.purohits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Configure RLS policies for public.bookings
DROP POLICY IF EXISTS "Allow user read own bookings" ON public.bookings;
CREATE POLICY "Allow user read own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Allow user insert own bookings" ON public.bookings;
CREATE POLICY "Allow user insert own bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Allow user update own bookings" ON public.bookings;
CREATE POLICY "Allow user update own bookings" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Allow user delete own bookings" ON public.bookings;
CREATE POLICY "Allow user delete own bookings" ON public.bookings
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Configure RLS policies for public.global_settings
DROP POLICY IF EXISTS "Allow public read access to global_settings" ON public.global_settings;
CREATE POLICY "Allow public read access to global_settings" ON public.global_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admins full access to global_settings" ON public.global_settings;
CREATE POLICY "Allow admins full access to global_settings" ON public.global_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Implement public.match_purohits database function (RPC) using spherical law of cosines
CREATE OR REPLACE FUNCTION public.match_purohits(
  user_sect TEXT,
  user_lang TEXT,
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  sect TEXT,
  languages TEXT[],
  distance DOUBLE PRECISION,
  booking_frequency INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate inputs
  IF user_sect IS NULL OR user_lang IS NULL OR user_lat IS NULL OR user_lng IS NULL OR user_lat = 'NaN'::double precision OR user_lng = 'NaN'::double precision THEN
    RAISE EXCEPTION 'Invalid parameters';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.sect,
    p.languages,
    (
      6371 * acos(
        CASE 
          WHEN sin(radians(user_lat)) * sin(radians(p.latitude)) + cos(radians(user_lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude - user_lng)) > 1.0 THEN 1.0
          WHEN sin(radians(user_lat)) * sin(radians(p.latitude)) + cos(radians(user_lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude - user_lng)) < -1.0 THEN -1.0
          ELSE sin(radians(user_lat)) * sin(radians(p.latitude)) + cos(radians(user_lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude - user_lng))
        END
      )
    )::DOUBLE PRECISION AS distance,
    p.booking_frequency
  FROM
    public.purohits p
  WHERE
    p.sect = user_sect
    AND user_lang = ANY(p.languages)
  ORDER BY
    distance ASC,
    p.booking_frequency DESC
  LIMIT 3;
END;
$$;

-- Seed the public.purohits table with 5 test records using static UUIDs and ON CONFLICT DO UPDATE
INSERT INTO public.purohits (id, name, sect, languages, latitude, longitude, booking_frequency)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Krishna Murthy', 'Smartha', ARRAY['Telugu', 'Sanskrit', 'Kannada'], 12.9716, 77.5946, 20),
  ('22222222-2222-2222-2222-222222222222', 'Srinivasa Sastry', 'Smartha', ARRAY['Telugu', 'Sanskrit', 'Kannada'], 12.9716, 77.5946, 10),
  ('33333333-3333-3333-3333-333333333333', 'Subrahmanya Bhat', 'Smartha', ARRAY['Telugu', 'Kannada', 'Sanskrit'], 12.9716, 77.5946, 5),
  ('44444444-4444-4444-4444-444444444444', 'Ramanuja Acharya', 'Vaishnava', ARRAY['Tamil', 'Sanskrit', 'Telugu'], 13.0827, 80.2707, 15),
  ('55555555-5555-5555-5555-555555555555', 'Shiva Prasad', 'Shaiva', ARRAY['Telugu', 'Hindi'], 17.3850, 78.4867, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sect = EXCLUDED.sect,
  languages = EXCLUDED.languages,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  booking_frequency = EXCLUDED.booking_frequency;
