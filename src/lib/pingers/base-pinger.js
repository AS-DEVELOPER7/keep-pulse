export class BasePinger {
  constructor(project) {
    this.project = project;
  }

  /**
   * Abstract ping method - must be implemented by drivers
   * @returns {Promise<{ success: boolean, statusCode: number, latencyMs: number, responseHead: string, responseBody: string, errorMessage?: string }>}
   */
  async executePing() {
    throw new Error('executePing() must be implemented by subclass');
  }

  formatHeaders(extraHeaders = {}) {
    let headers = {
      'User-Agent': 'KeepPulse-AutoPing/1.0',
      'Accept': 'application/json',
      ...extraHeaders,
    };
    
    if (this.project.headers_json) {
      try {
        const parsed = typeof this.project.headers_json === 'string' 
          ? JSON.parse(this.project.headers_json)
          : this.project.headers_json;
        headers = { ...headers, ...parsed };
      } catch (e) {
        console.warn('Failed to parse headers_json:', e);
      }
    }
    
    return headers;
  }
}
