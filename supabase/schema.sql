-- ====================================================================
-- KEEP-PULSE MASTER DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor to initialize KeepPulse
-- ====================================================================

-- Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- User isolation
  name TEXT NOT NULL,
  description TEXT,
  app_url TEXT,              -- Encrypted/Plain Live Web Application URL (e.g. https://spendly.app)
  target_url TEXT NOT NULL,  -- Encrypted API/Database ping URL (e.g. https://xyz.supabase.co)
  ping_method TEXT NOT NULL DEFAULT 'SUPABASE_TABLE', -- 'SUPABASE_TABLE' | 'SUPABASE_REST' | 'SUPABASE_AUTH' | 'HTTP_GET' | 'HTTP_POST'
  headers_json TEXT,         -- Encrypted JSON string for custom headers / API keys
  body_json TEXT,            -- Encrypted JSON string for credentials / request body
  interval_days INT NOT NULL DEFAULT 10, -- Ping frequency in days
  cron_expression TEXT,      -- Interval Option Key (e.g. '1_MIN', '5_MIN', '10_DAYS')
  last_ping_at TIMESTAMPTZ,
  next_ping_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'PAUSED' | 'FAILING'
  last_status INT,
  last_latency_ms INT,
  failure_count INT DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Ping Logs Table
CREATE TABLE IF NOT EXISTS public.ping_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'SUCCESS' | 'FAILED'
  status_code INT,
  latency_ms INT NOT NULL,
  response_head TEXT,
  response_body TEXT,
  error_message TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. System Config Table
CREATE TABLE IF NOT EXISTS public.system_config (
  id TEXT PRIMARY KEY DEFAULT 'global',
  is_setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
  admin_password_hash TEXT NOT NULL DEFAULT '',
  cron_secret TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initial default row in system_config
INSERT INTO public.system_config (id, is_setup_complete, admin_password_hash, cron_secret)
VALUES ('global', false, '', md5(random()::text))
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ping_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Safely create policies (drop existing first to ensure idempotent execution)
DROP POLICY IF EXISTS "Allow public full access to projects" ON public.projects;
CREATE POLICY "Allow public full access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public full access to ping_logs" ON public.ping_logs;
CREATE POLICY "Allow public full access to ping_logs" ON public.ping_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public full access to system_config" ON public.system_config;
CREATE POLICY "Allow public full access to system_config" ON public.system_config FOR ALL USING (true) WITH CHECK (true);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_next_ping ON public.projects(next_ping_at);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_ping_logs_project_id ON public.ping_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_ping_logs_executed_at ON public.ping_logs(executed_at DESC);

-- ====================================================================
-- MIGRATION STATEMENTS (Run if updating an existing KeepPulse database)
-- ====================================================================
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS app_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cron_expression TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
