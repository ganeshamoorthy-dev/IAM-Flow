import { AccountStubBackend } from './backend/AccountStubBackend';
import { UserStubBackend } from './backend/UserStubBackend';
import { RoleStubBackend } from './backend/RoleStubBackend';
import { PermissionStubBackend } from './backend/PermissionStubBackend';
import type { AccountCreateRequest, LoginRequest, OtpValidationRequest, RoleCreateRequest, SetPasswordRequest, UserCreateRequest } from '../services';
import { AuthStubBackend } from './backend/AuthStubBackend';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RoleUpdateRequest } from '../models/request/RoleUpdateRequest';
import type { UserUpdateRequest } from '../models/request/UserUpdateRequest';
import { OtpStubBackend } from './backend/OtpStubBackend';
import type { OtpResendRequest } from '../models/request/OtpResendRequest';

/**
 * Main stub backend service that routes requests based on URL patterns
 */
export class StubBackendService {

  private accountBackend = new AccountStubBackend();
  private userBackend = new UserStubBackend();
  private roleBackend = new RoleStubBackend();
  private permissionBackend = new PermissionStubBackend();
  private authBackend = new AuthStubBackend();
  private otpBackend = new OtpStubBackend();

  /**
   * Route and handle mock API requests
   */
  async handleRequest(config: InternalAxiosRequestConfig<unknown>, method: string, url: string, data?: unknown): Promise<AxiosResponse> {
    const normalizedMethod = method.toUpperCase();
    const normalizedUrl = this.normalizeUrl(url);

    console.log(`🎭 Stub Backend: ${normalizedMethod} ${normalizedUrl}`);

    try {

      if (this.matchesPattern(normalizedUrl, '/api/v1/auth/login')) {
        const token = await this.authBackend.login(data as LoginRequest);
        return this.prepareAxiosResponse(config, null, { "Authorization": `Bearer ${token}` });
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/auth/root-login')) {
        const token = await this.authBackend.login(data as LoginRequest);
        return this.prepareAxiosResponse(config, null, { "Authorization": `Bearer ${token}` });
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/auth/whoami')) {
        const response = await this.authBackend.whoami();
        return this.prepareAxiosResponse(config, response);
      }

      // Account routes
      if (this.matchesPattern(normalizedUrl, "/api/v1/accounts/create")) {
        if (normalizedMethod === 'POST') {
          const response = await this.accountBackend.createAccount(data as AccountCreateRequest);
          return this.prepareAxiosResponse(config, response);
        }
      }

      if (this.matchesPattern(normalizedUrl, "/api/v1/accounts/{id}/stats")) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{id}/stats', 'id');
        const response = await this.accountBackend.stats(parseInt(accountId));
        return this.prepareAxiosResponse(config, response);
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{id}')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{id}', 'id');
        if (normalizedMethod === 'GET') {
          const data = await this.accountBackend.getAccount(parseInt(accountId));
          return this.prepareAxiosResponse(config, data);
        } else if (normalizedMethod === 'DELETE') {
          await this.accountBackend.delete(parseInt(accountId));
          return this.prepareAxiosResponse(config);
        }
      }


      // User routes - Check specific routes first

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users/set-password')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/set-password', 'accountId');
        const response = await this.userBackend.setPassword(parseInt(accountId), data as SetPasswordRequest);
        return this.prepareAxiosResponse(config, response);
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users/list')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}', 'accountId');
        const response = await this.userBackend.getUsers(parseInt(accountId));
        return this.prepareAxiosResponse(config, response);
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}/enable')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}/enable', 'accountId');
        const userId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}', 'userId');
        const response = await this.userBackend.enable(parseInt(accountId), parseInt(userId));
        return this.prepareAxiosResponse(config, response);
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}/disable')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}/disable', 'accountId');
        const userId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}', 'userId');

        const response = await this.userBackend.disable(parseInt(accountId), parseInt(userId));
        return this.prepareAxiosResponse(config, response);
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}', 'accountId');
        const userId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/users/{userId}', 'userId');

        if (normalizedMethod === 'GET') {
          const response = await this.userBackend.getUser(parseInt(accountId), parseInt(userId));
          return this.prepareAxiosResponse(config, response);
        } else if (normalizedMethod === 'PUT' || normalizedMethod === 'PATCH') {
          const response = await this.userBackend.updateUser(parseInt(accountId), parseInt(userId), data as UserUpdateRequest);
          return this.prepareAxiosResponse(config, response);
        } else if (normalizedMethod === 'DELETE') {
          await this.userBackend.deleteUser(parseInt(accountId), parseInt(userId));
          return this.prepareAxiosResponse(config);
        }
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/users')) {
        const accountId = this.extractPathParam(normalizedUrl, '/accounts/{accountId}/users', 'accountId');
        if (normalizedMethod === 'POST') {
          const response = await this.userBackend.createUser(parseInt(accountId), data as UserCreateRequest);
          return this.prepareAxiosResponse(config, response);
        } else if (normalizedMethod === 'GET') {
          const response = await this.userBackend.getUsers(parseInt(accountId));
          return this.prepareAxiosResponse(config, response);
        }
      }

      // Role routes - Check specific routes first

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/roles/create')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/roles/create', 'accountId');

        if (normalizedMethod === 'POST') {
          const response = await this.roleBackend.createRole(parseInt(accountId), data as RoleCreateRequest);
          return this.prepareAxiosResponse(config, response);
        }
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/roles/list')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/roles/list', 'accountId');

        if (normalizedMethod === 'GET') {
          const response = await this.roleBackend.getRoles(parseInt(accountId));
          return this.prepareAxiosResponse(config, response);
        }
      }

      if (this.matchesPattern(normalizedUrl, '/api/v1/accounts/{accountId}/roles/{roleId}')) {
        const accountId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/roles/{roleId}', 'accountId');
        const roleId = this.extractPathParam(normalizedUrl, '/api/v1/accounts/{accountId}/roles/{roleId}', 'roleId');

        if (normalizedMethod === 'GET') {
          const response = await this.roleBackend.getRole(parseInt(accountId), parseInt(roleId));
          return this.prepareAxiosResponse(config, response);
        } else if (normalizedMethod === 'PUT') {
          const response = await this.roleBackend.updateRole(parseInt(accountId), parseInt(roleId), data as RoleUpdateRequest);
          return this.prepareAxiosResponse(config, response);
        } else if (normalizedMethod === 'DELETE') {
          const response = await this.roleBackend.deleteRole(parseInt(accountId), parseInt(roleId));
          return this.prepareAxiosResponse(config, response);
        }
      }

      // Permission routes
      if (normalizedUrl === '/api/v1/permissions/list') {
        if (normalizedMethod === 'GET') {
          const response = await this.permissionBackend.getPermissions();
          return this.prepareAxiosResponse(config, response);
        }
      }

      //otp routes
      if (normalizedUrl === '/api/v1/otp/resend') {
        const response = await this.otpBackend.generateOtp((data as OtpResendRequest)?.email);
        return this.prepareAxiosResponse(config, response);
      }

      if (normalizedUrl === '/api/v1/otp/validate') {
        const request = data as OtpValidationRequest;
        const response = await this.otpBackend.validateOtp(request.email, request.otp);
        return this.prepareAxiosResponse(config, response);
      }

      // If no route matches, throw an error
      throw new Error(`Route not found: ${normalizedMethod} ${normalizedUrl}`);

    } catch (error) {
      console.error('🚨 Stub Backend Error:', error);
      throw error;
    }
  }

  /**
   * Normalize URL by removing query parameters for pattern matching
   */
  private normalizeUrl(url: string): string {
    const urlObj = new URL(`http://localhost${url}`);
    return urlObj.pathname;
  }

  /**
   * Check if URL matches a pattern with path parameters
   */
  private matchesPattern(url: string, pattern: string): boolean {
    const urlParts = url.split('/').filter(part => part);
    const patternParts = pattern.split('/').filter(part => part);

    if (urlParts.length !== patternParts.length) {
      return false;
    }

    for (let i = 0; i < urlParts.length; i++) {
      const urlPart = urlParts[i];
      const patternPart = patternParts[i];

      // Check if pattern part is a parameter (e.g., {id})
      if (patternPart.startsWith('{') && patternPart.endsWith('}')) {
        continue; // This is a parameter, so it matches anything
      }

      // Otherwise, parts must match exactly
      if (urlPart !== patternPart) {
        return false;
      }
    }

    return true;
  }

  /**
   * Extract path parameter from URL based on pattern
   */
  private extractPathParam(url: string, pattern: string, paramName: string): string {
    const urlParts = url.split('/').filter(part => part);
    const patternParts = pattern.split('/').filter(part => part);

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];

      if (patternPart === `{${paramName}}`) {
        return urlParts[i];
      }
    }

    throw new Error(`Parameter ${paramName} not found in URL ${url} with pattern ${pattern}`);
  }


  private prepareAxiosResponse(config: InternalAxiosRequestConfig<unknown>, data?: unknown, headers: object = {}): AxiosResponse {

    // Create a mock axios response
    const mockResponse: AxiosResponse = {
      data: data,
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-powered-by': 'stub-backend',
        ...headers
      },
      config,
      request: {}
    };

    // Attach the mock response to the config for the response interceptor to use
    (config as InternalAxiosRequestConfig & { mockResponse?: AxiosResponse; }).mockResponse = mockResponse;

    // Modify the config to prevent the actual HTTP request
    config.adapter = async () => {
      return Promise.resolve(mockResponse);
    };

    return mockResponse;
  }
}

// Export singleton instance
export const stubBackendService = new StubBackendService();
