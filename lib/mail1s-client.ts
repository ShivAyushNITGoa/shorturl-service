// ===== MAIL1S.NET CLIENT FOR WEB APP =====
// TypeScript client for Mail1s.net API integration

export interface ShortLinkOptions {
  customAlias?: string;
  password?: string;
  expiration?: string;
  generateQR?: boolean;
}

export interface ShortLinkResult {
  short_url: string;
  long_url: string;
  qr_code?: string;
  created_at: string;
}

export interface MailboxResult {
  id: string;
  email: string;
  prefix: string;
  domain: string;
  created_at: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  received_at: string;
  read: boolean;
}

export interface MetadataResult {
  title: string;
  description: string;
  image?: string;
  url: string;
  author?: string;
  keywords?: string[];
}

export interface ScreenshotResult {
  screenshot_url: string;
  width: number;
  height: number;
  format: string;
}

export interface FileUploadResult {
  id: string;
  name: string;
  size: number;
  url: string;
  short_url?: string;
  created_at: string;
}

export class Mail1sClient {
  private proxyUrl = '/api/mail1s';
  private apiKey: string;

  constructor(apiKey: string = '33c9b99b-26d6-4127-9e50-83940f7c7876') {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      let url = this.proxyUrl;
      let options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'GET') {
        // Use query parameter for GET requests
        url = `${this.proxyUrl}?endpoint=${encodeURIComponent(endpoint)}`;
        options.method = 'GET';
      } else {
        // Use body for POST/DELETE requests
        options.body = JSON.stringify({
          endpoint,
          method,
          body,
        });
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Mail1s API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ===== SHORT LINK SERVICE =====
  async createShortLink(
    longUrl: string,
    options: ShortLinkOptions = {}
  ): Promise<ShortLinkResult> {
    const payload = {
      url: longUrl,
      custom_alias: options.customAlias || null,
      password: options.password || null,
      expiration: options.expiration || null,
      qr_code: options.generateQR !== false,
    };

    return this.request<ShortLinkResult>('/short-links', 'POST', payload);
  }

  async getShortLink(linkId: string): Promise<ShortLinkResult> {
    return this.request<ShortLinkResult>(`/short-links/${linkId}`);
  }

  async getShortLinkAnalytics(linkId: string): Promise<any> {
    return this.request<any>(`/short-links/${linkId}/analytics`);
  }

  async deleteShortLink(linkId: string): Promise<void> {
    await this.request<void>(`/short-links/${linkId}`, 'DELETE');
  }

  // ===== EMAIL SERVICE =====
  async createMailbox(
    prefix: string,
    domain: string = 'mail1s.net'
  ): Promise<MailboxResult> {
    const payload = {
      prefix,
      domain,
      catch_all: false,
    };

    return this.request<MailboxResult>('/mailboxes', 'POST', payload);
  }

  async getMailboxes(): Promise<MailboxResult[]> {
    return this.request<MailboxResult[]>('/mailboxes');
  }

  async getMailboxInbox(
    mailboxId: string,
    unreadOnly: boolean = false
  ): Promise<EmailMessage[]> {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread', 'true');

    return this.request<EmailMessage[]>(
      `/mailboxes/${mailboxId}/inbox?${params}`
    );
  }

  async sendEmail(
    mailboxId: string,
    to: string,
    subject: string,
    body: string,
    html?: string
  ): Promise<any> {
    const payload = {
      to,
      subject,
      text: body,
      html: html || null,
    };

    return this.request<any>(`/mailboxes/${mailboxId}/send`, 'POST', payload);
  }

  async deleteMailbox(mailboxId: string): Promise<void> {
    await this.request<void>(`/mailboxes/${mailboxId}`, 'DELETE');
  }

  // ===== OPEN API SERVICE =====
  async getWebsiteMetadata(url: string): Promise<MetadataResult> {
    const payload = { url };

    return this.request<MetadataResult>(
      '/open-api/metadata',
      'POST',
      payload
    );
  }

  async captureWebsiteScreenshot(
    url: string,
    width: number = 1920,
    height: number = 1080,
    format: string = 'png'
  ): Promise<ScreenshotResult> {
    const payload = {
      url,
      width,
      height,
      format,
    };

    return this.request<ScreenshotResult>(
      '/open-api/screenshot',
      'POST',
      payload
    );
  }

  async generateQRCode(url: string): Promise<{ qr_code_url: string }> {
    const payload = { url };

    return this.request<{ qr_code_url: string }>(
      '/open-api/qr-code',
      'POST',
      payload
    );
  }

  async convertWebsiteToMarkdown(url: string): Promise<{ markdown: string }> {
    const payload = { url };

    return this.request<{ markdown: string }>(
      '/open-api/convert-markdown',
      'POST',
      payload
    );
  }

  // ===== CLOUD STORAGE SERVICE =====
  async uploadFile(
    file: File,
    bucketName: string = 'default'
  ): Promise<FileUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucketName);

    try {
      const response = await fetch(`${this.proxyUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async listFiles(bucketName: string = 'default'): Promise<FileUploadResult[]> {
    return this.request<FileUploadResult[]>(
      `/storage/files?bucket=${bucketName}`
    );
  }

  async deleteFile(fileId: string, bucketName: string = 'default'): Promise<void> {
    await this.request<void>(
      `/storage/files/${fileId}?bucket=${bucketName}`,
      'DELETE'
    );
  }

  // ===== UTILITY METHODS =====
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async checkServiceStatus(): Promise<{ [key: string]: boolean }> {
    return this.request<{ [key: string]: boolean }>('/services/status');
  }

  isConnected(): boolean {
    return this.apiKey !== null && this.apiKey !== '';
  }
}

// Export singleton instance
export const mail1sClient = new Mail1sClient();
