-- MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine.
-- DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task.
-- A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

-- Create table public.purohits
CREATE TABLE IF NOT EXISTS public.purohits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sect TEXT NOT NULL CHECK (sect IN ('Smartha', 'Vaishnava', 'Shaiva')),
  languages TEXT[] NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  booking_frequency INTEGER DEFAULT 0 NOT NULL
);

-- Create table public.bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purohit_id UUID REFERENCES public.purohits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  muhurtham_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  dakshina NUMERIC NOT NULL,
  convenience_fee NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.purohits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is active on public.global_settings
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for public.purohits
CREATE POLICY "Allow public read access to purohits"
  ON public.purohits FOR SELECT
  USING (true);

CREATE POLICY "Allow admins full access to purohits"
  ON public.purohits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Setup RLS Policies for public.bookings
CREATE POLICY "Allow users to select their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins full access to bookings"
  ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create match_purohits function
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
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.sect,
    p.languages,
    sqrt(power(p.latitude - user_lat, 2) + power(p.longitude - user_lng, 2)) AS distance,
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
