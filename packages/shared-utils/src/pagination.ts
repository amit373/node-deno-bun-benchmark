import type { PaginatedResponse, PaginationParams } from '@student-api/shared-types';

export class PaginationUtil {
  static paginate<T>(data: T[], total: number, params: PaginationParams): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / params.limit);

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    };
  }

  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
