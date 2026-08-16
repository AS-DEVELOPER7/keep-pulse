import { BasePinger } from './base-pinger.js';

export class SupabaseAuthPinger extends BasePinger {
  async executePing() {
    const startTime = Date.now();
    try {
      let baseUrl = this.project.target_url.trim();
      // Ensure pointing to /auth/v1/
      let authUrl = baseUrl.includes('/auth/v1') 
        ? baseUrl 
        : `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}auth/v1/health`;

      const customHeaders = this.formatHeaders();
      const apiKey = customHeaders['apikey'] || '';

      const headers = {
        'apikey': apiKey,
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      let bodyData = null;
      let method = 'GET';

      if (this.project.body_json) {
        try {
          bodyData = typeof this.project.body_json === 'string'
            ? JSON.parse(this.project.body_json)
            : this.project.body_json;
          
          if (bodyData.email && bodyData.password) {
            authUrl = baseUrl.includes('/auth/v1')
              ? `${baseUrl}/token?grant_type=password`
              : `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}auth/v1/token?grant_type=password`;
            method = 'POST';
          }
        } catch (e) {
          console.warn('Failed to parse body_json for auth pinger:', e);
        }
      }

      const options = {
        method,
        headers,
        signal: AbortSignal.timeout(15000),
      };

      if (method === 'POST' && bodyData) {
        options.body = JSON.stringify(bodyData);
      }

      const response = await fetch(authUrl, { ...options });
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
        errorMessage: response.ok ? null : `Auth Ping HTTP ${statusCode}: ${response.statusText}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        statusCode: 0,
        latencyMs,
        responseHead: 'Connection Error',
        responseBody: '',
        errorMessage: error.message || 'Failed to reach Supabase Auth API endpoint',
      };
    }
  }
}
