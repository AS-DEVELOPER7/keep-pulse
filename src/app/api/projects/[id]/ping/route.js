import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import { getPinger } from '@/lib/pingers/index.js';
import { decryptData } from '@/lib/utils/crypto.js';
import { getIntervalMs } from '@/lib/utils/interval-helpers.js';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    const { data: project, error: fetchErr } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Decrypt credentials if stored encrypted
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

    const intervalKey = project.cron_expression || project.interval_days || '10_DAYS';
    const pingIntervalMs = getIntervalMs(intervalKey);
    const nextPingAt = new Date(Date.now() + pingIntervalMs).toISOString();
    const newStatus = pingResult.success ? 'ACTIVE' : 'FAILING';
    const newFailureCount = pingResult.success ? 0 : (project.failure_count || 0) + 1;

    // Record audit log
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

    // Update project state
    await supabaseAdmin
      .from('projects')
      .update({
        last_ping_at: new Date().toISOString(),
        next_ping_at: nextPingAt,
        status: newStatus,
        last_status: pingResult.statusCode,
        last_latency_ms: pingResult.latencyMs,
        failure_count: newFailureCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id);

    return NextResponse.json({
      success: pingResult.success,
      result: pingResult,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
