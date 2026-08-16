'use client';

import React from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { SqlSnippetViewer } from '@/components/organisms/target-sql/SqlSnippetViewer.jsx';

export default function TargetSqlPage() {
  return (
    <div>
      <PageHeader
        title="Target Project SQL Setup Query"
        description="Copy-pasteable SQL setup script for target Supabase projects to enable zero-storage-clutter pinging."
      />
      <SqlSnippetViewer />
    </div>
  );
}
