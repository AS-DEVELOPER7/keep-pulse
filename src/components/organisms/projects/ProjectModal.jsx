'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal.jsx';
import { FormField } from '@/components/molecules/common/FormField.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Select } from '@/components/atoms/Select.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { JsonFieldEditor } from '@/components/molecules/common/JsonFieldEditor.jsx';
import { PING_METHODS, INTERVAL_OPTIONS } from '@/constants';
import { getIntervalOptionKey } from '@/lib/utils/interval-helpers.js';

import { useToast } from '@/hooks/useToast.js';

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    app_url: '',
    description: '',
    target_url: '',
    ping_method: 'SUPABASE_HEALTH',
    interval_days: '1_MIN',
    headers_json: '',
    body_json: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        app_url: initialData.app_url || '',
        description: initialData.description || '',
        target_url: initialData.target_url || '',
        ping_method: initialData.ping_method || 'SUPABASE_HEALTH',
        interval_days: getIntervalOptionKey(initialData),
        headers_json: initialData.headers_json || '',
        body_json: initialData.body_json || '',
      });
    } else {
      setFormData({
        name: '',
        app_url: '',
        description: '',
        target_url: '',
        ping_method: 'SUPABASE_HEALTH',
        interval_days: '1_MIN',
        headers_json: '',
        body_json: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Please enter a project name.', 'Validation Warning');
      return;
    }
    if (!formData.target_url.trim()) {
      toast.warning('Please enter a target ping URL.', 'Validation Warning');
      return;
    }
    if (!formData.target_url.startsWith('http://') && !formData.target_url.startsWith('https://')) {
      toast.warning('Target Ping URL must start with http:// or https://', 'Validation Warning');
      return;
    }
    if (formData.app_url && !formData.app_url.startsWith('http://') && !formData.app_url.startsWith('https://')) {
      toast.warning('Live App URL must start with http:// or https://', 'Validation Warning');
      return;
    }
    onSubmit({
      ...formData,
      interval_days: formData.interval_days,
      ...(initialData?.id ? { id: initialData.id } : {}),
    });
  };

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" form="project-form" isLoading={isLoading}>
        {initialData ? 'Save Changes' : 'Create Project'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Monitored Project' : 'Add New Monitored Project'}
      footer={modalFooter}
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Project Name" required>
          <Input
            placeholder="e.g. Spendly App"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Live App URL (Website Address)" description="Direct link where users can visit your live application">
          <Input
            type="url"
            placeholder="https://spendly.app or https://your-app.com"
            value={formData.app_url}
            onChange={(e) => setFormData({ ...formData, app_url: e.target.value })}
          />
        </FormField>

        <FormField label="Target Ping / Supabase URL" required description="The API/Database URL that KeepPulse pings to keep active (e.g. https://xyz.supabase.co)">
          <Input
            type="url"
            placeholder="https://your-project.supabase.co"
            value={formData.target_url}
            onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ping Driver Method">
            <Select
              options={PING_METHODS}
              value={formData.ping_method}
              onChange={(e) => setFormData({ ...formData, ping_method: e.target.value })}
            />
          </FormField>

          <FormField label="Ping Interval">
            <Select
              options={INTERVAL_OPTIONS}
              value={String(formData.interval_days)}
              onChange={(e) => setFormData({ ...formData, interval_days: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Custom Headers (JSON / Key-Value)" description="Easily add custom headers such as apikey or Authorization tokens">
          <JsonFieldEditor
            value={formData.headers_json}
            onChange={(jsonStr) => setFormData((prev) => ({ ...prev, headers_json: jsonStr }))}
            placeholderKey="Header Key (e.g. apikey)"
            placeholderValue="Header Value"
            defaultKeys={['apikey', 'Authorization']}
          />
        </FormField>

        <FormField label="Request Payload / Body (JSON / Key-Value)" description="Optional payload body for custom requests">
          <JsonFieldEditor
            value={formData.body_json}
            onChange={(jsonStr) => setFormData((prev) => ({ ...prev, body_json: jsonStr }))}
            placeholderKey="Field Key"
            placeholderValue="Field Value"
            defaultKeys={['source', 'notes']}
          />
        </FormField>

        <FormField label="Description (Optional)">
          <Input
            placeholder="Main production database keep-alive"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </FormField>
      </form>
    </Modal>
  );
}
