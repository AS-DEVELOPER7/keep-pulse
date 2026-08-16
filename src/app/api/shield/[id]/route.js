import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabaseAdmin = getSupabaseAdmin();

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('name, status, last_ping_at')
      .eq('id', id)
      .single();

    const isHealthy = project?.status === 'ACTIVE';
    const statusText = isHealthy ? 'active' : 'failing';
    const color = isHealthy ? '#10b981' : '#f43f5e';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="20">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <mask id="a">
        <rect width="130" height="20" rx="3" fill="#fff"/>
      </mask>
      <g mask="url(#a)">
        <path fill="#555" d="0 0 h70 v20 H0z"/>
        <path fill="${color}" d="M70 0 h60 v20 H70z"/>
        <path fill="url(#b)" d="0 0 h130 v20 H0z"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="35" y="15" fill="#010101" fill-opacity=".3">KeepPulse</text>
        <text x="35" y="14">KeepPulse</text>
        <text x="100" y="15" fill="#010101" fill-opacity=".3">${statusText}</text>
        <text x="100" y="14">${statusText}</text>
      </g>
    </svg>`;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
