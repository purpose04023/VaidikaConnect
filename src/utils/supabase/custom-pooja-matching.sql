-- Enable pgvector extension for semantic embedding searches
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Pooja Embeddings Cache Table
CREATE TABLE IF NOT EXISTS public.pooja_embeddings (
  id SERIAL PRIMARY KEY,
  user_query TEXT NOT NULL CHECK (length(user_query) > 0),
  embedding vector(768) NOT NULL, -- Matched with models/text-embedding-004
  parsed_requirements JSONB NOT NULL,
  pandit_count INT CHECK (pandit_count > 0 AND pandit_count <= 10),
  estimated_cost DECIMAL(10,2) CHECK (estimated_cost >= 0),
  region TEXT,
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  usage_count INT DEFAULT 1 CHECK (usage_count > 0),
  source TEXT DEFAULT 'llm', -- 'llm' | 'cache' | 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Pooja Embeddings
ALTER TABLE public.pooja_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to embeddings"
  ON public.pooja_embeddings FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access to embeddings"
  ON public.pooja_embeddings FOR ALL
  USING (true); -- Managed through service role key in Edge Functions

-- Create HNSW index for cosine distance searches
CREATE INDEX IF NOT EXISTS pooja_embeddings_hnsw_idx
  ON public.pooja_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_embeddings_usage_count
  ON public.pooja_embeddings (usage_count DESC);


-- 2. Regional Deity Aliases Table (Tier 2 Mapping)
CREATE TABLE IF NOT EXISTS public.regional_deity_aliases (
  id SERIAL PRIMARY KEY,
  regional_alias VARCHAR(200) NOT NULL, -- e.g. "Mutyalamma"
  canonical_deity VARCHAR(200) NOT NULL,  -- e.g. "Devi/Shakti"
  ritual_archetype VARCHAR(100),            -- e.g. "Puja", "Homam", "Nomu"
  associated_region VARCHAR(200),           -- e.g. "Andhra Pradesh"
  typical_pandits INT DEFAULT 1,
  notes TEXT,
  confidence_score FLOAT DEFAULT 1.0,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(regional_alias, associated_region)
);

ALTER TABLE public.regional_deity_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to aliases"
  ON public.regional_deity_aliases FOR SELECT
  USING (true);

CREATE POLICY "Allow admin full access to aliases"
  ON public.regional_deity_aliases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed regional aliases with Telugu traditions
INSERT INTO public.regional_deity_aliases 
  (regional_alias, canonical_deity, ritual_archetype, associated_region, typical_pandits)
VALUES
  ('Ammavari', 'Devi/Shakti', 'Puja', 'Andhra Pradesh', 1),
  ('Mutyalamma', 'Devi/Shakti', 'Puja', 'Andhra Pradesh', 1),
  ('Sammakka', 'Devi/Shakti', 'Puja', 'Telangana', 1),
  ('Mahakali', 'Devi/Shakti', 'Homam', 'Telangana', 2),
  ('Bonalu', 'Devi/Shakti', 'Puja', 'Telangana', 1),
  ('Pochamma', 'Devi/Shakti', 'Puja', 'Andhra Pradesh', 1),
  ('Ellamma', 'Devi/Shakti', 'Puja', 'Karnataka', 1),
  ('Vinayaka Chavithi', 'Ganesha', 'Puja', 'Andhra Pradesh', 1),
  ('Karthika Masam', 'Shiva', 'Vratam', 'Andhra Pradesh', 1),
  ('Nagula Chavithi', 'Naga Devata', 'Puja', 'Andhra Pradesh', 1)
ON CONFLICT (regional_alias, associated_region) DO NOTHING;


-- 3. Custom Ritual Booking Orders Table
CREATE TABLE IF NOT EXISTS public.custom_ritual_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_user_input TEXT NOT NULL,
  resolved_vector_id VARCHAR(255),
  
  -- AI Parsed Fields
  interpreted_deity VARCHAR(200),
  ritual_archetype VARCHAR(100),
  target_region VARCHAR(200),
  preferred_language VARCHAR(50),
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  location_type VARCHAR(50) DEFAULT 'home',
  location_address TEXT,
  
  -- Dynamic parameters
  whatsapp_number VARCHAR(50) NOT NULL,
  generated_materials TEXT[],
  
  -- Quote pricing
  status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'price_assigned', 'completed')),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.custom_ritual_orders ENABLE ROW LEVEL SECURITY;

-- Users can see their own custom orders
CREATE POLICY "Allow users to view their own custom orders"
  ON public.custom_ritual_orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own custom orders
CREATE POLICY "Allow users to insert their own custom orders"
  ON public.custom_ritual_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view and update all custom orders
CREATE POLICY "Allow admins full access to custom orders"
  ON public.custom_ritual_orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- 4. Cosine similarity RPC function for pgvector queries
CREATE OR REPLACE FUNCTION public.match_poojas (
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id INT,
  user_query TEXT,
  parsed_requirements JSONB,
  similarity FLOAT,
  usage_count INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate embedding dimension
  IF array_length(query_embedding, 1) != 768 THEN
    RAISE EXCEPTION 'Invalid embedding dimension. Expected 768, got %',
      array_length(query_embedding, 1);
  END IF;

  -- Update usage count for matched rows (analytics)
  UPDATE public.pooja_embeddings
  SET
    usage_count = usage_count + 1,
    updated_at = NOW()
  WHERE public.pooja_embeddings.id IN (
    SELECT pe.id
    FROM public.pooja_embeddings pe
    WHERE 1 - (pe.embedding <=> query_embedding) > match_threshold
    ORDER BY pe.embedding <=> query_embedding ASC
    LIMIT match_count
  );

  -- Return results with similarity scores
  RETURN QUERY
  SELECT
    pe.id,
    pe.user_query,
    pe.parsed_requirements,
    (1 - (pe.embedding <=> query_embedding))::FLOAT AS similarity,
    pe.usage_count
  FROM public.pooja_embeddings pe
  WHERE 1 - (pe.embedding <=> query_embedding) > match_threshold
  ORDER BY pe.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;


-- 5. Alter Profiles to add WhatsApp column just in case schema.sql did not run fully
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_whatsapp TEXT;
