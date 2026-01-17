import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  stubBackendRequestInterceptor,
  stubBackendResponseInterceptor,
  stubBackendErrorInterceptor
} from '../mock/interceptors/StubBackendInterceptor';
import { configService } from './config/ConfigService';
import type { ErrorResponse } from '../models/common/ErrorResponse';


class ApiClient {

  private client: AxiosInstance;

  constructor () {
    this.client = axios.create({
      baseURL: configService.getBaseUrl(),
      timeout: configService.getTimeout(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {

    // Stub backend request interceptor (must be first)
    this.client.interceptors.request.use(stubBackendRequestInterceptor);

    // Regular request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {

        // Log request in development
        if (configService.isDevelopment()) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            headers: config.headers,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Handle stub backend responses
        const stubResponse = stubBackendResponseInterceptor(response);

        // Log response in development
        if (configService.isDevelopment()) {
          console.log(`✅ API Response: ${response.status}`, {
            data: response.data,
            headers: response.headers,
          });
        }

        return stubResponse;
      },
      (error: AxiosError) => {
        // Handle stub backend errors first
        stubBackendErrorInterceptor(error).catch(() => {
          // If stub backend error handler doesn't handle it, continue with regular error handling
        });

        const apiError: ErrorResponse = {
          message: 'An error occurred',
          code: error.code,
          causes: []
        };

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const responseData = error.response.data as { message?: string; };
          apiError.message = responseData?.message || 'Server error occurred';

          // Handle authentication errors
          if (error.response.status === 401) {
            apiError.message = 'Unauthorized. Please login again.';
            // Redirect to login if needed
            // window.location.href = '/login';
          } else if (error.response.status === 403) {
            apiError.message = 'Access forbidden. Insufficient permissions.';
          }
        } else if (error.request) {
          // Network error
          apiError.message = 'Network error. Please check your connection.';
        }

        console.error('❌ API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // HTTP Methods
  public async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return response;
  }

  public async post<T, D = unknown>(url: string, data?: D, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return response;
  }

  public async put<T, D = unknown>(url: string, data?: D, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return response;
  }

  public async patch<T, D = unknown>(url: string, data?: D, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return response;
  }

  public async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return response;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
