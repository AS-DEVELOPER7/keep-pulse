'use client';

import React from 'react';
import { Card } from '@/components/atoms/Card.jsx';

export function Table({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  renderMobileCard,
}) {
  if (isLoading) {
    return (
      <Card padding="p-8" className="text-center text-slate-500">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
        <p className="mt-2 text-sm">Loading data...</p>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card padding="p-8" className="text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm font-medium">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.header} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key || col.header} className="px-6 py-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-4">
        {data.map((row, idx) => (
          <React.Fragment key={row.id || idx}>
            {renderMobileCard ? (
              renderMobileCard(row)
            ) : (
              <Card padding="p-4" className="space-y-2">
                {columns.map((col) => (
                  <div key={col.key || col.header} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-slate-100 dark:border-slate-800/60 pb-1.5 last:border-none last:pb-0">
                    <span className="font-semibold text-slate-500 flex-shrink-0">{col.header}:</span>
                    <div className="min-w-0">{col.render ? col.render(row) : row[col.key]}</div>
                  </div>
                ))}
              </Card>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
