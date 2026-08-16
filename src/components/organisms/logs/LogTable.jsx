'use client';

import React from 'react';
import { Table } from '@/components/organisms/common/Table.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { Badge } from '@/components/atoms/Badge.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function LogTable({ logs = [], isLoading = false, onViewDetails }) {
  const columns = [
    {
      header: 'Project Name',
      key: 'project_name',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
            {row.projects?.name || 'Unknown Project'}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs block mt-0.5">
            {row.projects?.description || row.projects?.app_url || 'Monitored database keep-alive'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <Badge status={row.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED'} />
      ),
    },
    {
      header: 'HTTP Code',
      key: 'status_code',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.status_code || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Latency',
      key: 'latency_ms',
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {row.latency_ms} ms
        </span>
      ),
    },
    {
      header: 'Executed',
      key: 'executed_at',
      render: (row) => (
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(row.executed_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          icon={Eye}
          onClick={() => onViewDetails(row)}
        >
          View
        </Button>
      ),
    },
  ];

  const renderMobileCard = (row) => (
    <Card padding="p-4" className="space-y-3">
      {/* Top Header: Project Name & Description + Badge */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {row.projects?.name || 'Unknown Project'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {row.projects?.description || row.projects?.app_url || 'Monitored database keep-alive'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Badge status={row.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED'} />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">HTTP Code</span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {row.status_code || 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Latency</span>
          <span className="font-medium text-slate-600 dark:text-slate-400">
            {row.latency_ms} ms
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Executed</span>
          <span className="text-slate-500">
            {formatDistanceToNow(new Date(row.executed_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          icon={Eye}
          onClick={() => onViewDetails(row)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <Table
      columns={columns}
      data={logs}
      isLoading={isLoading}
      renderMobileCard={renderMobileCard}
    />
  );
}
