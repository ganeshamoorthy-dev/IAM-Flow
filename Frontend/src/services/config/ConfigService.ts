/**
 * Service configuration interface
 */
export interface ServiceConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
  version: string;
  useMock: boolean;
  environment: string;
}

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, fallback: string): string => {
  return import.meta.env[key] || fallback;
};

/**
 * Get boolean environment variable with fallback
 */
const getEnvBool = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

/**
 * Default service configuration
 */
const DEFAULT_CONFIG: ServiceConfig = {
  baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080'),
  timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000'), 10),
  retries: parseInt(getEnvVar('VITE_API_RETRIES', '3'), 10),
  enableLogging: getEnvBool('VITE_ENABLE_LOGGING', import.meta.env.DEV || false),
  version: getEnvVar('VITE_API_VERSION', 'v1'),
  useMock: getEnvBool('VITE_USE_MOCK', false),
  environment: getEnvVar('VITE_APP_ENV', import.meta.env.DEV ? 'development' : 'production')
};

/**
 * Configuration manager for services
 */
export class ConfigService {
  private static instance: ConfigService;
  private config: ServiceConfig;

  private constructor () {
    this.config = { ...DEFAULT_CONFIG };
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  getTimeout(): number {
    return this.config.timeout;
  }

  isLoggingEnabled(): boolean {
    return this.config.enableLogging;
  }

  getRetries(): number {
    return this.config.retries;
  }

  getVersion(): string {
    return this.config.version;
  }

  useMockData(): boolean {
    return this.config.useMock;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }
}

// Export singleton instance
export const configService = ConfigService.getInstance();
