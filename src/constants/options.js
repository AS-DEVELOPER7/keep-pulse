// Centralized application options & dropdown constants

export const PING_METHODS = [
  { value: 'SUPABASE_HEALTH', label: 'Supabase Health & REST API (Zero-Setup)' },
];

export const INTERVAL_OPTIONS = [
  { value: '1_MIN', label: '⚡ Every 1 Minute (Testing Mode)' },
  { value: '5_MIN', label: '⚡ Every 5 Minutes (Testing Mode)' },
  { value: '1_DAY', label: 'Every 1 Day (Daily)' },
  { value: '3_DAYS', label: 'Every 3 Days' },
  { value: '5_DAYS', label: 'Every 5 Days (Recommended for Supabase)' },
  { value: '7_DAYS', label: 'Every 7 Days (Weekly)' },
  { value: '10_DAYS', label: 'Every 10 Days' },
  { value: '14_DAYS', label: 'Every 14 Days (Bi-weekly)' },
  { value: '20_DAYS', label: 'Every 20 Days' },
];

export const PROJECT_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'FAILING', label: 'Failing' },
];

export const LOG_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'SUCCESS', label: 'Success Only' },
  { value: 'FAILED', label: 'Failed Only' },
];
