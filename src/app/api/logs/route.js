import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin.js';
import { decryptData } from '@/lib/utils/crypto.js';

function formatLogRecord(log) {
  if (!log) return log;
  let formattedProject = log.projects;
  if (formattedProject) {
    let cleanTargetUrl = formattedProject.target_url;
    if (cleanTargetUrl && cleanTargetUrl.startsWith('{')) {
      cleanTargetUrl = decryptData(cleanTargetUrl) || cleanTargetUrl;
    }
    let cleanAppUrl = formattedProject.app_url;
    if (cleanAppUrl && cleanAppUrl.startsWith('{')) {
      cleanAppUrl = decryptData(cleanAppUrl) || cleanAppUrl;
    }

    formattedProject = {
      ...formattedProject,
      target_url: cleanTargetUrl,
      app_url: cleanAppUrl,
      description: formattedProject.description || 'Monitored database keep-alive',
    };
  }
  return {
    ...log,
    projects: formattedProject,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const summary = searchParams.get('summary');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    const supabaseAdmin = getSupabaseAdmin();

    if (summary === 'true') {
      // Calculate dashboard summary metrics
      const { data: projects } = await supabaseAdmin.from('projects').select('*');
      const { data: logs } = await supabaseAdmin
        .from('ping_logs')
        .select('*, projects(id, name, description, app_url, target_url)')
        .order('executed_at', { ascending: false })
        .limit(100);

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'ACTIVE').length || 0;
      const failingProjects = projects?.filter(p => p.status === 'FAILING').length || 0;
      
      const formattedLogs = (logs || []).map(formatLogRecord);
      const totalPings = formattedLogs.length;
      const successfulPings = formattedLogs.filter(l => l.status === 'SUCCESS').length;
      const uptimeRate = totalPings > 0 ? Math.round((successfulPings / totalPings) * 100) : 100;

      const avgLatency = totalPings > 0 
        ? Math.round(formattedLogs.reduce((acc, l) => acc + (l.latency_ms || 0), 0) / totalPings) 
        : 0;

      const now = new Date();
      const riskProjects = projects?.filter(p => {
        if (!p.last_ping_at) return true;
        const diffDays = (now.getTime() - new Date(p.last_ping_at).getTime()) / (1000 * 3600 * 24);
        return diffDays >= 15;
      }) || [];

      return NextResponse.json({
        totalProjects,
        activeProjects,
        failingProjects,
        totalPings,
        uptimeRate,
        avgLatency,
        riskProjects,
        recentLogs: formattedLogs.slice(0, 10),
      });
    }

    let query = supabaseAdmin
      .from('ping_logs')
      .select('*, projects(name, description, app_url, target_url)')
      .order('executed_at', { ascending: false })
      .limit(50);

    if (projectId && projectId !== 'ALL') {
      query = query.eq('project_id', projectId);
    }
    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const formattedData = (data || []).map(formatLogRecord);
    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
