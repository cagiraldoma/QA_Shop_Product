import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResponseBody, ApiError, RequestOptions } from './types';
import { testLogger } from '@utils/logger';

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private baseURL: string,
    private authToken?: string,
  ) {}

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) h['Authorization'] = `Bearer ${this.authToken}`;
    return h;
  }

  private async requestWithError<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponseBody<T>> {
    const url = `${this.baseURL}${endpoint}`;
    testLogger.debug(`${method} ${url}`);

    const requestOptions: Record<string, unknown> = {
      headers: { ...this.headers(), ...options?.headers },
      timeout: options?.timeout || 30000,
    };
    if (body) {
      requestOptions.data = body;
    }

    let response: APIResponse;
    switch (method.toLowerCase()) {
      case 'get':
        response = await this.request.get(url, requestOptions);
        break;
      case 'post':
        response = await this.request.post(url, requestOptions);
        break;
      case 'put':
        response = await this.request.put(url, requestOptions);
        break;
      case 'patch':
        response = await this.request.patch(url, requestOptions);
        break;
      case 'delete':
        response = await this.request.delete(url, requestOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    if (!response.ok()) {
      const errorBody = await response.json().catch(() => ({}));
      const error: ApiError = {
        statusCode: response.status(),
        message: (errorBody as Record<string, unknown>).message as string || `HTTP ${response.status()}`,
        errors: (errorBody as Record<string, unknown>).errors as Array<{ field: string; message: string }>,
      };
      throw error;
    }

    return response.json() as Promise<ApiResponseBody<T>>;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponseBody<T>> {
    return this.requestWithError<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponseBody<T>> {
    return this.requestWithError<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponseBody<T>> {
    return this.requestWithError<T>('PUT', endpoint, body, options);
  }

  async patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponseBody<T>> {
    return this.requestWithError<T>('PATCH', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponseBody<T>> {
    return this.requestWithError<T>('DELETE', endpoint, undefined, options);
  }

  async getRaw<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    testLogger.debug(`GET ${url} (raw)`);

    const requestOptions: Record<string, unknown> = {
      headers: { ...this.headers(), ...options?.headers },
      timeout: options?.timeout || 30000,
    };

    const response = await this.request.get(url, requestOptions);
    if (!response.ok()) {
      const errorBody = await response.json().catch(() => ({}));
      const error: ApiError = {
        statusCode: response.status(),
        message: (errorBody as Record<string, unknown>).message as string || `HTTP ${response.status()}`,
        errors: (errorBody as Record<string, unknown>).errors as Array<{ field: string; message: string }>,
      };
      throw error;
    }
    return response.json() as Promise<T>;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }
}
