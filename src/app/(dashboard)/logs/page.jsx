'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { Select } from '@/components/atoms/Select.jsx';
import { LogTable } from '@/components/organisms/logs/LogTable.jsx';
import { ResponseViewer } from '@/components/organisms/logs/ResponseViewer.jsx';
import { useGetPingLogsQuery } from '@/store/services/pingLogsApi';
import { useGetProjectsQuery } from '@/store/services/projectsApi';
import { LOG_STATUS_OPTIONS } from '@/constants';

export default function LogsPage() {
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: logs = [], isLoading } = useGetPingLogsQuery(
    {
      projectId: selectedProject,
      status: selectedStatus,
    },
    { pollingInterval: 4000 }
  );

  const projectOptions = [
    { value: 'ALL', label: 'All Monitored Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

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

      <Card padding="p-0 overflow-hidden">
        <LogTable
          logs={logs}
          isLoading={isLoading}
          onViewDetails={(log) => setSelectedLog(log)}
        />
      </Card>

      <ResponseViewer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
