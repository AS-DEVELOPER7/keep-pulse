import { BasePinger } from './base-pinger.js';

export class SupabaseRestPinger extends BasePinger {
  async executePing() {
    const startTime = Date.now();
    try {
      // Ensure target URL points to REST API endpoint
      let url = this.project.target_url.trim();
      if (!url.includes('/rest/v1/')) {
        url = url.endsWith('/') ? `${url}rest/v1/` : `${url}/rest/v1/`;
      }

      // Parse custom headers or extract API key
      const customHeaders = this.formatHeaders();
      const apiKey = customHeaders['apikey'] || customHeaders['Authorization']?.replace('Bearer ', '') || '';

      const headers = {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(15000),
      });

      const latencyMs = Date.now() - startTime;
      const statusCode = response.status;
      const responseHead = `${response.status} ${response.statusText}`;
      const responseBody = await response.text();
      const truncatedBody = responseBody.slice(0, 500);

      return {
        success: response.ok || statusCode < 400,
        statusCode,
        latencyMs,
        responseHead,
        responseBody: truncatedBody,
        errorMessage: response.ok ? null : `HTTP Error ${statusCode}: ${response.statusText}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        statusCode: 0,
        latencyMs,
        responseHead: 'Connection Error',
        responseBody: '',
        errorMessage: error.message || 'Failed to reach Supabase REST API endpoint',
      };
    }
  }
}
