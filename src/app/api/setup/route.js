import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import crypto from 'crypto';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('system_config')
      .select('is_setup_complete')
      .eq('id', 'global')
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ isSetupComplete: false, error: error.message }, { status: 200 });
    }

    return NextResponse.json({
      isSetupComplete: !!data?.is_setup_complete,
    });
  } catch (error) {
    return NextResponse.json({ isSetupComplete: false, error: error.message }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { admin_password } = body;

    if (!admin_password || admin_password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const passwordHash = crypto.createHash('sha256').update(admin_password).digest('hex');
    const cronSecret = crypto.randomBytes(16).toString('hex');

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('system_config').upsert({
      id: 'global',
      is_setup_complete: true,
      admin_password_hash: passwordHash,
      cron_secret: cronSecret,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, cronSecret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
