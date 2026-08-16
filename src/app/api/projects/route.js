import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import { encryptData, decryptData } from '@/lib/utils/crypto.js';
import { getIntervalMs, getDbIntervalDays } from '@/lib/utils/interval-helpers.js';
import { initBackgroundScheduler } from '@/lib/scheduler/scheduler.js';

function formatProjectData(project) {
  if (!project) return null;
  const decryptedUrl = decryptData(project.target_url) || project.target_url;
  const decryptedAppUrl = project.app_url ? (decryptData(project.app_url) || project.app_url) : null;
  const decryptedHeaders = project.headers_json ? (decryptData(project.headers_json) || project.headers_json) : '';
  const decryptedBody = project.body_json ? (decryptData(project.body_json) || project.body_json) : '';

  return {
    ...project,
    target_url: decryptedUrl,
    app_url: decryptedAppUrl,
    headers_json: typeof decryptedHeaders === 'object' ? JSON.stringify(decryptedHeaders, null, 2) : decryptedHeaders,
    body_json: typeof decryptedBody === 'object' ? JSON.stringify(decryptedBody, null, 2) : decryptedBody,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const supabaseAdmin = getSupabaseAdmin();

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json(formatProjectData(data));
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const formatted = (data || []).map(formatProjectData);
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      app_url,
      description,
      target_url,
      ping_method,
      interval_days,
      headers_json,
      body_json,
    } = body;

    if (!name || !target_url) {
      return NextResponse.json({ error: 'Name and Target URL are required' }, { status: 400 });
    }

    const intervalKey = String(interval_days || '10_DAYS');
    const intervalMs = getIntervalMs(intervalKey);
    const dbIntervalDays = getDbIntervalDays(intervalKey);
    const nextPingAt = new Date(Date.now() + intervalMs).toISOString();

    const encryptedTargetUrl = encryptData(target_url);
    const encryptedAppUrl = app_url ? encryptData(app_url) : null;
    const encryptedHeaders = headers_json ? encryptData(headers_json) : null;
    const encryptedBody = body_json ? encryptData(body_json) : null;

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        app_url: encryptedAppUrl,
        description: description || null,
        target_url: encryptedTargetUrl,
        ping_method: ping_method || 'SUPABASE_TABLE',
        interval_days: dbIntervalDays,
        cron_expression: intervalKey,
        headers_json: encryptedHeaders,
        body_json: encryptedBody,
        next_ping_at: nextPingAt,
        status: 'ACTIVE',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(formatProjectData(data));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, app_url, description, target_url, ping_method, interval_days, headers_json, body_json } = body;

    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    const intervalKey = String(interval_days || '10_DAYS');
    const intervalMs = getIntervalMs(intervalKey);
    const dbIntervalDays = getDbIntervalDays(intervalKey);
    const nextPingAt = new Date(Date.now() + intervalMs).toISOString();

    const encryptedTargetUrl = encryptData(target_url);
    const encryptedAppUrl = app_url ? encryptData(app_url) : null;
    const encryptedHeaders = headers_json ? encryptData(headers_json) : null;
    const encryptedBody = body_json ? encryptData(body_json) : null;

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        name,
        app_url: encryptedAppUrl,
        description,
        target_url: encryptedTargetUrl,
        ping_method,
        interval_days: dbIntervalDays,
        cron_expression: intervalKey,
        headers_json: encryptedHeaders,
        body_json: encryptedBody,
        next_ping_at: nextPingAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(formatProjectData(data));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
