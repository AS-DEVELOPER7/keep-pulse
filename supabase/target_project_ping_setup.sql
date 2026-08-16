-- ====================================================================
-- KEEP-PULSE TARGET PROJECT KEEP-ALIVE SETUP
-- Run this query in any target Supabase project SQL Editor
-- ====================================================================

-- 1. Create a lightweight keep-alive ping table in target project
CREATE TABLE IF NOT EXISTS public._keep_alive_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'KeepPulse Auto-Ping',
  notes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public._keep_alive_pings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing Read & Write access for KeepPulse
CREATE POLICY "Allow public select for keep_alive_pings" 
ON public._keep_alive_pings FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert for keep_alive_pings" 
ON public._keep_alive_pings FOR INSERT 
WITH CHECK (true);

-- 4. Create an automatic Cleanup Function (Keeps only last 50 pings to prevent database bloat)
CREATE OR REPLACE FUNCTION public.clean_old_keep_alive_pings()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public._keep_alive_pings
  WHERE id NOT IN (
    SELECT id FROM public._keep_alive_pings
    ORDER BY pinged_at DESC
    LIMIT 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger cleanup on every ping insert
DROP TRIGGER IF EXISTS trg_clean_old_pings ON public._keep_alive_pings;
CREATE TRIGGER trg_clean_old_pings
AFTER INSERT ON public._keep_alive_pings
FOR EACH STATEMENT
EXECUTE FUNCTION public.clean_old_keep_alive_pings();

-- 6. Insert initial test row
INSERT INTO public._keep_alive_pings (notes) VALUES ('Table created successfully by KeepPulse setup script');
