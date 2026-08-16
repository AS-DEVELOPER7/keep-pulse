import { BasePinger } from './base-pinger.js';

export class HttpPinger extends BasePinger {
  async executePing() {
    const startTime = Date.now();
    try {
      const url = this.project.target_url.trim();
      const method = this.project.ping_method === 'HTTP_POST' ? 'POST' : 'GET';
      const headers = this.formatHeaders();

      const options = {
        method,
        headers,
        signal: AbortSignal.timeout(15000),
      };

      if (method === 'POST' && this.project.body_json) {
        try {
          options.body = typeof this.project.body_json === 'string'
            ? this.project.body_json
            : JSON.stringify(this.project.body_json);
        } catch (e) {
          options.body = String(this.project.body_json);
        }
      }

      const response = await fetch(url, options);
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
        errorMessage: response.ok ? null : `HTTP Ping Error ${statusCode}: ${response.statusText}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        statusCode: 0,
        latencyMs,
        responseHead: 'Connection Error',
        responseBody: '',
        errorMessage: error.message || 'Failed to complete HTTP request',
      };
    }
  }
}
