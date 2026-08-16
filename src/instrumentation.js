export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[KeepPulse] Initializing Node.js server instrumentation & background scheduler...');
    const { initBackgroundScheduler } = await import('@/lib/scheduler/scheduler.js');
    initBackgroundScheduler();
  }
}
