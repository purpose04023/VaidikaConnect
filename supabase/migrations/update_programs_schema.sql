-- SQL migration script to update programs table schema with categories text[]
-- Paste and run this script inside your Supabase SQL Editor.

-- 1. Ensure categories column exists as text[]
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}'::text[];

-- 2. Populate categories from existing data (program_type and category_en)
UPDATE public.programs
SET categories = ARRAY[
  CASE 
    WHEN program_type = 'VAIDIKA_POOJA' THEN 'Vaidika Poojas'
    WHEN program_type = 'LIFE_CYCLE_POOJA' THEN 'Life Cycle Poojas'
    ELSE NULL
  END,
  CASE
    WHEN category_en = 'Deeksha Pujas' THEN 'Deeksha Poojalu'
    ELSE category_en
  END
]
WHERE categories IS NULL OR cardinality(categories) = 0;

-- 3. Ensure all other columns from schema.sql exist
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS title_te TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS description_te TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS image_hint TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS required_items TEXT[] DEFAULT '{}'::text[];
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS sloka_tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- 4. Update/Recreate stotrams table
DO $$
BEGIN
    -- If the stotrams table exists with a generic 'content' column, drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stotrams' AND column_name = 'content'
    ) THEN
        DROP TABLE IF EXISTS public.stotrams CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.stotrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deity_name TEXT NOT NULL,
  name_te TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  image_hint TEXT,
  image_url TEXT,
  ashtotharam_url TEXT,
  sahasranamam_url TEXT,
  ashtotharam_text TEXT,
  sahasranamam_text TEXT,
  reading_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Stotrams
ALTER TABLE public.stotrams ENABLE ROW LEVEL SECURITY;

-- Re-create policies
DROP POLICY IF EXISTS "Allow public read access to stotrams" ON public.stotrams;
CREATE POLICY "Allow public read access to stotrams" ON public.stotrams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admins full access to stotrams" ON public.stotrams;
CREATE POLICY "Allow admins full access to stotrams" ON public.stotrams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


