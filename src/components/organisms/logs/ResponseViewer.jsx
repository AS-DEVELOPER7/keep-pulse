'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/atoms/Modal.jsx';
import { Badge } from '@/components/atoms/Badge.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Copy, Check } from 'lucide-react';

export function ResponseViewer({ log, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!log) return null;

  const getFormattedBody = (rawBody) => {
    if (!rawBody) return 'No response body snippet available.';
    try {
      const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return rawBody;
    }
  };

  const formattedBody = getFormattedBody(log.response_body);

  const handleCopyBody = () => {
    navigator.clipboard.writeText(formattedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusText = log.response_head
    ? log.response_head.startsWith(String(log.status_code || ''))
      ? log.response_head
      : `${log.status_code || ''} ${log.response_head}`.trim()
    : `${log.status_code || 'N/A'}`;

  const modalFooter = (
    <div className="flex items-center justify-between">
      <div className="text-[11px] text-slate-400">
        Executed at: {new Date(log.executed_at).toLocaleString()}
      </div>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Execution Details: ${log.projects?.name || log.project?.name || 'Project Ping'}`}
      footer={modalFooter}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header metrics bar */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Status Code
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {statusText}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Latency
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {log.latency_ms} ms
            </span>
          </div>
          <Badge status={log.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED'} />
        </div>

        {/* Error message */}
        {log.error_message && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
            <span className="font-bold block mb-1">Error Details:</span>
            <span>{log.error_message}</span>
          </div>
        )}

        {/* Beautified JSON Response Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Response Body Snippet:
            </span>
            {log.response_body && (
              <button
                onClick={handleCopyBody}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72 whitespace-pre border border-slate-800 shadow-inner leading-relaxed">
            {formattedBody}
          </pre>
        </div>
      </div>
    </Modal>
  );
}
