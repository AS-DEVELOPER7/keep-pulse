// Helper functions for clean interval parsing and formatting

export function getIntervalMs(intervalValue) {
  const str = String(intervalValue || '10_DAYS').trim();
  
  switch (str) {
    case '1_MIN':
    case '0.0006944444444444444':
      return 60 * 1000; // 1 minute
    case '5_MIN':
    case '0.003472222222222222':
      return 5 * 60 * 1000; // 5 minutes
    case '1_DAY':
    case '1':
      return 24 * 60 * 60 * 1000;
    case '3_DAYS':
    case '3':
      return 3 * 24 * 60 * 60 * 1000;
    case '5_DAYS':
    case '5':
      return 5 * 24 * 60 * 60 * 1000;
    case '7_DAYS':
    case '7':
      return 7 * 24 * 60 * 60 * 1000;
    case '10_DAYS':
    case '10':
      return 10 * 24 * 60 * 60 * 1000;
    case '14_DAYS':
    case '14':
      return 14 * 24 * 60 * 60 * 1000;
    case '20_DAYS':
    case '20':
      return 20 * 24 * 60 * 60 * 1000;
    default: {
      const num = parseFloat(str) || 10;
      if (num < 0.01) return 60 * 1000;
      return Math.round(num * 24 * 60 * 60 * 1000);
    }
  }
}

export function getDbIntervalDays(intervalValue) {
  const str = String(intervalValue || '10_DAYS').trim();
  if (str === '1_MIN' || str === '5_MIN') return 1;
  const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) || num < 1 ? 10 : num;
}

export function getIntervalOptionKey(project) {
  if (!project) return '1_MIN';

  const validKeys = ['1_MIN', '5_MIN', '1_DAY', '3_DAYS', '5_DAYS', '7_DAYS', '10_DAYS', '14_DAYS', '20_DAYS'];

  if (project.cron_expression && validKeys.includes(project.cron_expression)) {
    return project.cron_expression;
  }

  if (typeof project.interval_days === 'string' && validKeys.includes(project.interval_days)) {
    return project.interval_days;
  }

  if (project.next_ping_at) {
    const startTime = project.last_ping_at ? new Date(project.last_ping_at) : new Date(project.created_at || Date.now());
    const diffMs = new Date(project.next_ping_at).getTime() - startTime.getTime();
    if (diffMs > 0 && diffMs <= 180000) return '1_MIN';
    if (diffMs > 180000 && diffMs <= 450000) return '5_MIN';
  }

  const days = Number(project.interval_days);
  if (days === 1) return '1_DAY';
  if (days === 3) return '3_DAYS';
  if (days === 5) return '5_DAYS';
  if (days === 7) return '7_DAYS';
  if (days === 10) return '10_DAYS';
  if (days === 14) return '14_DAYS';
  if (days === 20) return '20_DAYS';

  return '10_DAYS';
}

export function formatIntervalLabel(project, isCompact = false) {
  if (!project) return '10 Days';
  
  if (project.cron_expression === '1_MIN' || project.interval_days === '1_MIN') {
    return isCompact ? '1 Min (Testing)' : '1 Minute (Testing Mode)';
  }
  if (project.cron_expression === '5_MIN' || project.interval_days === '5_MIN') {
    return isCompact ? '5 Min (Testing)' : '5 Minutes (Testing Mode)';
  }

  if (project.next_ping_at) {
    const startTime = project.last_ping_at ? new Date(project.last_ping_at) : new Date(project.created_at || Date.now());
    const diffMs = new Date(project.next_ping_at).getTime() - startTime.getTime();
    if (diffMs > 0 && diffMs <= 180000) {
      return isCompact ? '1 Min (Testing)' : '1 Minute (Testing Mode)';
    }
    if (diffMs > 180000 && diffMs <= 450000) {
      return isCompact ? '5 Min (Testing)' : '5 Minutes (Testing Mode)';
    }
  }

  const days = Number(project.interval_days || 10);
  if (days === 1) return isCompact ? '1 Day (Daily)' : '1 Day (Daily)';
  return `${days} Days`;
}
