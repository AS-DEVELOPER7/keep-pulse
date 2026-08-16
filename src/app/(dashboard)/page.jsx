'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { StatCard } from '@/components/molecules/common/StatCard.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { InactivityRiskBanner } from '@/components/organisms/dashboard/InactivityRiskBanner.jsx';
import { LogTable } from '@/components/organisms/logs/LogTable.jsx';
import { ResponseViewer } from '@/components/organisms/logs/ResponseViewer.jsx';
import { useGetDashboardSummaryQuery } from '@/store/services/dashboardApi';
import { usePingAllProjectsNowMutation } from '@/store/services/projectsApi';
import { 
  Layers, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Play, 
  Plus 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: summary, isLoading, refetch } = useGetDashboardSummaryQuery(undefined, {
    pollingInterval: 4000,
  });
  const [pingAll, { isLoading: isPingingAll }] = usePingAllProjectsNowMutation();
  const [selectedLog, setSelectedLog] = useState(null);

  const handlePingAll = async () => {
    await pingAll().unwrap();
    refetch();
  };

  return (
    <div>
      <PageHeader
        title="Monitoring Dashboard"
        description="Real-time overview of active cloud projects, scheduled pings, and system health."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              icon={Play}
              onClick={handlePingAll}
              isLoading={isPingingAll}
            >
              Ping All Now
            </Button>
            <Link href="/projects">
              <Button icon={Plus}>Add Project</Button>
            </Link>
          </div>
        }
      />

      {/* Inactivity Risk Warning Banner */}
      <InactivityRiskBanner riskProjects={summary?.riskProjects || []} />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Monitored"
          value={summary?.totalProjects || 0}
          subtext="Registered Projects"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Active Guarded"
          value={summary?.activeProjects || 0}
          subtext="Healthy Projects"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Overall Uptime"
          value={`${summary?.uptimeRate || 100}%`}
          subtext="Ping Success Rate"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Avg Latency"
          value={`${summary?.avgLatency || 0} ms`}
          subtext="Response Speed"
          icon={Clock}
          color="indigo"
        />
      </div>

      {/* Recent Ping Logs Activity Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            Recent Keep-Alive Pings
          </h3>
          <Link href="/logs" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All Logs &rarr;
          </Link>
        </div>

        <Card padding="p-0 overflow-hidden">
          <LogTable
            logs={summary?.recentLogs || []}
            isLoading={isLoading}
            onViewDetails={(log) => setSelectedLog(log)}
          />
        </Card>
      </div>

      {/* Response Inspector Modal */}
      <ResponseViewer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
