'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/atoms/Card.jsx';
import { Badge } from '@/components/atoms/Badge.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { 
  Play, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { formatIntervalLabel } from '@/lib/utils/interval-helpers.js';

export function ProjectCard({
  project,
  onPingNow,
  onEdit,
  onDelete,
  isPinging,
}) {
  const lastPingText = project.last_ping_at
    ? formatDistanceToNow(new Date(project.last_ping_at), { addSuffix: true })
    : 'Never pinged';

  const getNextPingText = (nextPingAt) => {
    if (!nextPingAt) return 'Scheduled';
    const pingDate = new Date(nextPingAt);
    const now = new Date();
    if (pingDate <= now) {
      return 'Due Now (Pending)';
    }
    return formatDistanceToNow(pingDate, { addSuffix: true });
  };

  const nextPingText = getNextPingText(project.next_ping_at);

  // Calculate days since last ping for risk alert
  const daysSinceLastPing = project.last_ping_at
    ? differenceInDays(new Date(), new Date(project.last_ping_at))
    : 99;

  const isRiskAlert = daysSinceLastPing >= 15;

  return (
    <Card className="flex flex-col justify-between w-full hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 overflow-hidden">
      <div>
        {/* Top bar with Name, Description, and Status */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 truncate">
                {project.name}
              </h3>
              {project.app_url && (
                <a
                  href={project.app_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
                  title={`Visit Live Application: ${project.app_url}`}
                >
                  <span className="truncate max-w-[140px]">{project.app_url.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              )}
              {isRiskAlert && (
                <span className="p-1 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex-shrink-0" title="Inactivity Risk: >15 days without ping">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                </span>
              )}
            </div>
            {/* Show Description below Project Name & App URL */}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {project.description || 'Monitored database keep-alive'}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Badge status={project.status} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
          <div className="min-w-0">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Ping Interval
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block" title={formatIntervalLabel(project)}>
              {formatIntervalLabel(project, true)}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Driver Method
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
              {project.ping_method?.replace('SUPABASE_', '') || 'TABLE'}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-1">
            <span className="text-slate-400 text-[11px] flex items-center gap-1 truncate">
              <Clock className="w-3 h-3 flex-shrink-0" /> Last: {lastPingText}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-medium flex items-center gap-1 truncate">
              <Zap className="w-3 h-3 flex-shrink-0" /> Next: {nextPingText}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/projects/${project.id}`}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline py-1"
        >
          View Details & Logs &rarr;
        </Link>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPingNow(project.id)}
            isLoading={isPinging}
            icon={Play}
          >
            Ping Now
          </Button>
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
