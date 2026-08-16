'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { Badge } from '@/components/atoms/Badge.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { LogTable } from '@/components/organisms/logs/LogTable.jsx';
import { ResponseViewer } from '@/components/organisms/logs/ResponseViewer.jsx';
import { useGetProjectByIdQuery, usePingProjectNowMutation } from '@/store/services/projectsApi';
import { useGetPingLogsQuery } from '@/store/services/pingLogsApi';
import { formatIntervalLabel } from '@/lib/utils/interval-helpers.js';
import { useToast } from '@/hooks/useToast.js';
import { Play, ExternalLink, ArrowLeft, Clock, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(id, {
    pollingInterval: 4000,
  });
  const { data: logs = [], isLoading: isLogsLoading, refetch } = useGetPingLogsQuery(
    { projectId: id },
    { pollingInterval: 4000 }
  );
  const [pingNow, { isLoading: isPinging }] = usePingProjectNowMutation();
  const [selectedLog, setSelectedLog] = useState(null);

  const handlePing = async () => {
    try {
      const res = await pingNow(id).unwrap();
      refetch();
      if (res?.success) {
        toast.success(`Keep-alive ping to "${project?.name}" succeeded!`);
      } else {
        toast.error(res?.result?.errorMessage || 'Ping failed');
      }
    } catch (err) {
      toast.error(err?.data?.error || err?.message || 'Ping failed');
    }
  };

  if (isProjectLoading) {
    return (
      <Card padding="p-8 text-center text-slate-500">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
        <p className="mt-2 text-sm">Loading project details...</p>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card padding="p-8 text-center text-slate-500">
        <p className="text-sm font-semibold">Project not found.</p>
        <Link href="/projects" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">
          &larr; Back to Projects
        </Link>
      </Card>
    );
  }

  const lastPingText = project.last_ping_at
    ? formatDistanceToNow(new Date(project.last_ping_at), { addSuffix: true })
    : 'Never pinged';

  const getNextPingText = (nextPingAt) => {
    if (!nextPingAt) return 'Scheduled';
    const date = new Date(nextPingAt);
    if (date <= new Date()) return 'Due Now (Pending)';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const nextPingText = getNextPingText(project.next_ping_at);

  // Attach project info to logs if missing
  const enrichedLogs = logs.map((log) => ({
    ...log,
    projects: log.projects || project,
  }));

  return (
    <div>
      <div className="mb-4">
        <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </Link>
      </div>

      <PageHeader
        title={project.name}
        description={project.description || 'Monitored database keep-alive'}
        actions={
          <div className="flex items-center gap-3">
            <Badge status={project.status} />
            <Button icon={Play} onClick={handlePing} isLoading={isPinging}>
              Ping Now
            </Button>
          </div>
        }
      />

      {/* Project Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card padding="p-5" className="flex items-center gap-4 min-w-0">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block truncate">
              Ping Interval
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate" title={formatIntervalLabel(project)}>
              {formatIntervalLabel(project, true)}
            </h4>
            <p className="text-xs text-slate-500 truncate">Last: {lastPingText}</p>
          </div>
        </Card>

        <Card padding="p-5" className="flex items-center gap-4 min-w-0">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block truncate">
              Next Scheduled Ping
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {nextPingText}
            </h4>
            <p className="text-xs text-slate-500 truncate">Auto-Driver Active</p>
          </div>
        </Card>

        <Card padding="p-5" className="flex items-center gap-4 min-w-0">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block truncate">
              Ping Driver Method
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {project.ping_method?.replace('SUPABASE_', '') || 'TABLE'}
            </h4>
            <a
              href={project.app_url || project.target_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline truncate"
            >
              <span>{project.app_url ? 'Visit App' : 'Visit Target'}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </Card>
      </div>

      {/* Execution Audit Logs Stream */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Execution History & Logs ({enrichedLogs.length})
        </h3>
        <Card padding="p-0 overflow-hidden">
          <LogTable
            logs={enrichedLogs}
            isLoading={isLogsLoading}
            onViewDetails={(log) => setSelectedLog(log)}
          />
        </Card>
      </div>

      <ResponseViewer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
