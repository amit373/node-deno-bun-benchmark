export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: ValidationError[];
  timestamp: string;
  path?: string;
  statusCode?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  runtime: 'node' | 'deno' | 'bun';
}
