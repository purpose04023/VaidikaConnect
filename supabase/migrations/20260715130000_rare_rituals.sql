-- Alter profiles check constraint to allow 'acharya' role
DO $$
BEGIN
  -- Drop constraint if it exists (try common names or search/replace)
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  -- Add updated check constraint
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'poojari', 'admin', 'acharya'));
END $$;

-- Create quarantined_rituals table
CREATE TABLE IF NOT EXISTS public.quarantined_rituals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create public_rituals table
CREATE TABLE IF NOT EXISTS public.public_rituals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  samagri TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create ritual_votes table (to store Acharya approval/votes)
CREATE TABLE IF NOT EXISTS public.ritual_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quarantined_ritual_id UUID REFERENCES public.quarantined_rituals(id) ON DELETE CASCADE,
  acharya_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  samagri TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(quarantined_ritual_id, acharya_id)
);

-- Enable RLS
ALTER TABLE public.quarantined_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_votes ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for quarantined_rituals
DROP POLICY IF EXISTS "Allow users to view their own quarantined requests" ON public.quarantined_rituals;
CREATE POLICY "Allow users to view their own quarantined requests"
  ON public.quarantined_rituals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert quarantined requests" ON public.quarantined_rituals;
CREATE POLICY "Allow users to insert quarantined requests"
  ON public.quarantined_rituals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow acharyas/admins full access to quarantined requests" ON public.quarantined_rituals;
CREATE POLICY "Allow acharyas/admins full access to quarantined requests"
  ON public.quarantined_rituals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'acharya')
    )
  );

-- Setup RLS Policies for public_rituals
DROP POLICY IF EXISTS "Allow public read access to public_rituals" ON public.public_rituals;
CREATE POLICY "Allow public read access to public_rituals"
  ON public.public_rituals FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow acharyas/admins full access to public_rituals" ON public.public_rituals;
CREATE POLICY "Allow acharyas/admins full access to public_rituals"
  ON public.public_rituals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'acharya')
    )
  );

-- Setup RLS Policies for ritual_votes
DROP POLICY IF EXISTS "Allow acharyas/admins access to votes" ON public.ritual_votes;
CREATE POLICY "Allow acharyas/admins access to votes"
  ON public.ritual_votes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'acharya')
    )
  );
