import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import { getPinger } from '@/lib/pingers/index.js';
import { decryptData } from '@/lib/utils/crypto.js';

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: projects, error } = await supabaseAdmin.from('projects').select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!projects || projects.length === 0) {
      return NextResponse.json({ message: 'No projects registered' });
    }

    const results = [];

    for (const project of projects) {
      const decryptedHeaders = project.headers_json ? decryptData(project.headers_json) : null;
      const decryptedBody = project.body_json ? decryptData(project.body_json) : null;

      const projectToPing = {
        ...project,
        headers_json: decryptedHeaders || project.headers_json,
        body_json: decryptedBody || project.body_json,
      };

      const pinger = getPinger(projectToPing);
      const pingResult = await pinger.executePing();

      const intervalDays = project.interval_days || 10;
      const nextPingAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

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

      await supabaseAdmin
        .from('projects')
        .update({
          last_ping_at: new Date().toISOString(),
          next_ping_at: nextPingAt,
          status: pingResult.success ? 'ACTIVE' : 'FAILING',
          last_status: pingResult.statusCode,
          last_latency_ms: pingResult.latencyMs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      results.push({ projectId: project.id, name: project.name, success: pingResult.success });
    }

    return NextResponse.json({ success: true, count: results.length, results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
