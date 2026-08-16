-- ====================================================================
-- KEEP-PULSE SUPABASE PG_CRON BACKGROUND EXECUTION SETUP
-- Run this in your KeepPulse Supabase project to enable automatic background pings!
-- ====================================================================

-- 1. Enable required extensions for automated cron background requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
 
-- 2. Create a background execution function that calls the KeepPulse cron API route
CREATE OR REPLACE FUNCTION public.trigger_keeppulse_cron()
RETURNS void AS $$
DECLARE
  v_cron_secret TEXT;
  -- Base URL of your KeepPulse application (without /api/cron/trigger path)
  v_app_url TEXT := 'http://192.168.0.57:3001'; 
BEGIN
  -- Retrieve configured cron secret from system_config table
  SELECT cron_secret INTO v_cron_secret FROM public.system_config WHERE id = 'global';
  
  -- Fallback if system_config token is empty
  IF v_cron_secret IS NULL OR v_cron_secret = '' THEN
    v_cron_secret := 'keep_pulse_cron_secret_token_123';
  END IF;

  -- Trigger HTTP GET request to KeepPulse cron API endpoint
  PERFORM net.http_get(
    url := v_app_url || '/api/cron/trigger?secret=' || v_cron_secret,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Schedule the cron job to run every hour (checks if any projects are due for pinging)
SELECT cron.schedule(
  'keeppulse-hourly-ping-check',
  '0 * * * *', -- Runs every hour at minute 0
  $$SELECT public.trigger_keeppulse_cron();$$
);
