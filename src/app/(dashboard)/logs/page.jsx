'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { Select } from '@/components/atoms/Select.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { LogTable } from '@/components/organisms/logs/LogTable.jsx';
import { ResponseViewer } from '@/components/organisms/logs/ResponseViewer.jsx';
import { useGetPingLogsQuery } from '@/store/services/pingLogsApi';
import { useGetProjectsQuery } from '@/store/services/projectsApi';
import { LOG_STATUS_OPTIONS } from '@/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LogsPage() {
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: logs = [], isLoading } = useGetPingLogsQuery(
    {
      projectId: selectedProject,
      status: selectedStatus,
    },
    { pollingInterval: 4000 }
  );

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProject, selectedStatus]);

  const projectOptions = [
    { value: 'ALL', label: 'All Monitored Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  // Pagination calculations
  const totalLogs = logs.length;
  const totalPages = Math.ceil(totalLogs / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = logs.slice(startIndex, endIndex);

  return (
    <div>
      <PageHeader
        title="Audit Logs Stream"
        description="Detailed execution logs, response status codes, and latency measurements across all pings."
      />

      {/* Log Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Select
          options={projectOptions}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        />
        <Select
          options={LOG_STATUS_OPTIONS}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        />
      </div>

      {/* Log Table */}
      <Card padding="p-0 overflow-hidden">
        <LogTable
          logs={paginatedLogs}
          isLoading={isLoading}
          onViewDetails={(log) => setSelectedLog(log)}
        />
      </Card>

      {/* Pagination Controls */}
      {totalLogs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-700 dark:text-slate-200">{startIndex + 1}</strong> to{' '}
              <strong className="text-slate-700 dark:text-slate-200">{Math.min(endIndex, totalLogs)}</strong> of{' '}
              <strong className="text-slate-700 dark:text-slate-200">{totalLogs}</strong> logs
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[11px] text-slate-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={ChevronLeft}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Log Response Details Viewer */}
      <ResponseViewer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
