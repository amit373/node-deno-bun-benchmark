import type { ApiResponse, ErrorResponse, ValidationError } from '@student-api/shared-types';

export class ResponseFormatter {
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string,
    statusCode?: number,
    error?: string,
    errors?: ValidationError[]
  ): ErrorResponse {
    return {
      success: false,
      message,
      error,
      errors,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  static validationError(errors: ValidationError[]): ErrorResponse {
    return {
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    };
  }
}
