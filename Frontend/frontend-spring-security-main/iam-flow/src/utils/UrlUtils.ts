/**
 * Utility to build query parameters from an object
 */
export class UrlUtils {
  /**
   * Build query parameters from an object
   */
  static buildQueryParams<T extends object>(params?: T): URLSearchParams {
    const searchParams = new URLSearchParams();
    if (!params) return searchParams;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams;
  }

  /**
   * Build a URL with query parameters
   */
  static buildUrl<T extends object>(endpoint: string, params?: T): string {
    const queryParams = UrlUtils.buildQueryParams(params);
    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }

  /**
   * Replace path params in a URL template
   * Example: buildPath('/accounts/:accountId/users/:userId', { accountId: 1, userId: 2 })
   * returns '/accounts/1/users/2'
   */
  static buildPath(template: string, pathParams: Record<string, string | number>): string {
    return Object.entries(pathParams).reduce((url, [key, value]) => {
      return url.replace(new RegExp(`:${key}(?=/|$)`, 'g'), encodeURIComponent(String(value)));
    }, template);
  }
}
