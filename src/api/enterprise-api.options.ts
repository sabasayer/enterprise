export interface EnterpriseApiOptions {
  baseUrl?: string;
  protocol?: "http" | "https";
  /**
   * en-us , tr-tr , etc.
   */
  languagePrefix?: string;
  hostName?: string;
  headers?: Record<string, string>;
}
