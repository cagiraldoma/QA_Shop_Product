export interface ApiResponseBody<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}
