import cron from "node-cron";

export function initBackgroundScheduler() {
  // Destroy any previous cron task in Node process memory (handles Next.js hot-reloads)
  if (globalThis.__keepPulseCronTask) {
    try {
      console.log(
        "[KeepPulse Engine] Stopping existing background cron task instance...",
      );
      globalThis.__keepPulseCronTask.stop();
    } catch (e) {
      // ignore
    }
  }

  console.log(
    "[KeepPulse Engine] Starting single automated background ping scheduler worker (node-cron)...",
  );

  const executePingCheck = async () => {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
      const secret =
        process.env.CRON_SECRET || "keep_pulse_cron_secret_token_123";

      const res = await fetch(`${appUrl}/api/cron/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cron-Secret": secret,
        },
        body: JSON.stringify({ source: "node-cron" }),
      });

      const data = await res.json().catch(() => ({}));
      if (data?.executedCount > 0) {
        console.log(
          "[KeepPulse Engine] Scheduled pings completed successfully:",
          data,
        );
      }
    } catch (error) {
      console.error(
        "[KeepPulse Engine] Background scheduler execution error:",
        error,
      );
    }
  };

  // Schedule to run every hour (0 * * * *)
  const task = cron.schedule("0 * * * *", executePingCheck);
  globalThis.__keepPulseCronTask = task;
  globalThis.__keepPulseSchedulerRunning = true;
}
