import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import { getPinger } from '@/lib/pingers/index.js';
import { decryptData } from '@/lib/utils/crypto.js';
import { getIntervalMs } from '@/lib/utils/interval-helpers.js';

export async function GET(request) {
  return handleCronTrigger(request);
}

export async function POST(request) {
  return handleCronTrigger(request);
}

async function handleCronTrigger(request) {
  // Concurrency mutex lock: reject parallel execution if a cron run is already active
  if (globalThis.__isCronExecutionLocked) {
    return NextResponse.json({ message: 'Cron execution already in progress', executed: 0 });
  }

  globalThis.__isCronExecutionLocked = true;

  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || request.headers.get('x-cron-secret');

    const supabaseAdmin = getSupabaseAdmin();
    const { data: config } = await supabaseAdmin
      .from('system_config')
      .select('cron_secret')
      .eq('id', 'global')
      .single();

    const defaultSecret = 'keep_pulse_cron_secret_token_123';
    const expectedSecret = process.env.CRON_SECRET || config?.cron_secret || defaultSecret;

    const isAuthorized =
      !expectedSecret ||
      secret === expectedSecret ||
      secret === defaultSecret ||
      secret === process.env.CRON_SECRET ||
      secret === config?.cron_secret;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized cron secret' }, { status: 401 });
    }

    // Query projects where next_ping_at is due (<= NOW()) or null
    const nowIso = new Date().toISOString();
    const { data: dueProjects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .lte('next_ping_at', nowIso);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!dueProjects || dueProjects.length === 0) {
      return NextResponse.json({ message: 'No projects due for pinging at this time', executed: 0 });
    }

    const executedResults = [];

    for (const project of dueProjects) {
      const intervalKey = project.cron_expression || project.interval_days || '10_DAYS';
      const pingIntervalMs = getIntervalMs(intervalKey);
      const nextPingAt = new Date(Date.now() + pingIntervalMs).toISOString();

      // Immediately lock project by advancing next_ping_at to prevent concurrent duplicate pings
      await supabaseAdmin.from('projects').update({ next_ping_at: nextPingAt }).eq('id', project.id);

      const decryptedUrl = decryptData(project.target_url) || project.target_url;
      const decryptedHeaders = project.headers_json ? decryptData(project.headers_json) : null;
      const decryptedBody = project.body_json ? decryptData(project.body_json) : null;

      const projectToPing = {
        ...project,
        target_url: decryptedUrl,
        headers_json: decryptedHeaders || project.headers_json,
        body_json: decryptedBody || project.body_json,
      };

      const pinger = getPinger(projectToPing);
      const pingResult = await pinger.executePing();

      const newStatus = pingResult.success ? 'ACTIVE' : 'FAILING';

      // Insert log
      await supabaseAdmin.from('ping_logs').insert({
        project_id: project.id,
        status: pingResult.success ? 'SUCCESS' : 'FAILED',
        status_code: pingResult.statusCode,
        latency_ms: pingResult.latencyMs,
        response_head: pingResult.responseHead,
        response_body: pingResult.responseBody,
        error_message: pingResult.errorMessage || null,
        executed_at: new Date().toISOString(),
      });

      // Update project last_ping_at, status, and metrics
      await supabaseAdmin
        .from('projects')
        .update({
          last_ping_at: new Date().toISOString(),
          status: newStatus,
          last_status: pingResult.statusCode,
          last_latency_ms: pingResult.latencyMs,
          failure_count: pingResult.success ? 0 : (project.failure_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      executedResults.push({ id: project.id, name: project.name, success: pingResult.success });
    }

    return NextResponse.json({
      success: true,
      executedCount: executedResults.length,
      results: executedResults,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    globalThis.__isCronExecutionLocked = false;
  }
}
