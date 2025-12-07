/**
 * Application configuration
 * Reads from environment variables with sensible defaults
 */

export const appConfig = {
  /**
   * The name of the CRM application
   * Can be overridden via NEXT_PUBLIC_CRM_NAME environment variable
   */
  crmName: process.env.NEXT_PUBLIC_CRM_NAME || "Insight Loop CRM",
} as const;

