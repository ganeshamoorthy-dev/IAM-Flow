import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { stubBackendService } from '../StubBackendService';
import { configService } from '../../services/config/ConfigService';

/**
 * Request interceptor for handling stub backend routing
 */
export const stubBackendRequestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  
  // Only intercept in development mode when using mock data
  if (!configService.useMockData() || !configService.isDevelopment()) {
    return config;
  }

  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || '';
  const data = config.data;

  console.log(`🎭 Intercepting request for stub backend: ${method} ${url} ${JSON.stringify(data)}`);

  try {
    // Handle the request through stub backend and return the response
    await stubBackendService.handleRequest(config, method, url, data);
    
  } catch (error) {
    console.error('🚨 Stub backend error:', error);
    // Re-throw the error so it can be handled by the error interceptor
    throw error;
  }
  
  return config;
};

/**
 * Response interceptor for stub backend
 */
export const stubBackendResponseInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  
  // Check if this was a mock response
  if (response.headers && response.headers['x-powered-by'] === 'stub-backend') {
    console.log(`✅ Stub backend response: ${response.status}`, response.data);
  }
  
  return response;
};

/**
 * Error response interceptor for stub backend
 */
export const stubBackendErrorInterceptor = (error: unknown): Promise<never> => {
  
  // Check if this was a mock error
  const axiosError = error as { response?: { headers?: Record<string, string>; status?: number; data?: unknown } };
  if (axiosError.response?.headers?.['x-powered-by'] === 'stub-backend') {
    console.error('❌ Stub backend error response:', axiosError.response.status, axiosError.response.data);
  }
  
  return Promise.reject(error);
};
