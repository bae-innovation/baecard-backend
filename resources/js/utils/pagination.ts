import type { PaginationState } from '@tanstack/react-table';

import type { LaravelPaginationMeta } from '@/lib/schema';

/**
 * Type guard to check if a response is a paginated response.
 * Useful for runtime checks before calling parsePaginatedResponse.
 *
 * This function checks if the response has the structure of a Laravel paginated response:
 * - Has `success: true`
 * - Has a `data` object with pagination metadata fields
 * - The `data.data` field is an array
 *
 * @param data - The unknown data to check
 * @returns true if the data appears to be a paginated response, false otherwise
 *
 * @example
 * const response = await apiClient.get('products').json();
 *
 * if (isPaginatedResponse(response)) {
 *   // Safe to use parsePaginatedResponse
 *   const { data, pagination } = parsePaginatedResponse(response, productSchema);
 * } else {
 *   // Handle non-paginated response
 *   const data = parseResponse(response, productsSchema);
 * }
 */
export function isPaginatedResponse(data: unknown): data is {
  success: true;
  data: {
    current_page: number;
    data: unknown[];
    total: number;
    per_page: number;
    [key: string]: unknown;
  };
  message: string;
} {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === true &&
    'data' in data &&
    typeof data.data === 'object' &&
    data.data !== null &&
    'current_page' in data.data &&
    typeof data.data.current_page === 'number' &&
    'total' in data.data &&
    typeof data.data.total === 'number' &&
    'per_page' in data.data &&
    typeof data.data.per_page === 'number' &&
    'data' in data.data &&
    Array.isArray(data.data.data)
  );
}

/**
 * Creates query parameters for Laravel pagination.
 * Converts TanStack Table's 0-based pagination to Laravel's 1-based pagination.
 *
 * @param pageIndex - The 0-based page index from TanStack Table
 * @param pageSize - The number of items per page
 * @returns Query parameters object with `page` and `per_page` for Laravel API
 *
 * @example
 * // TanStack Table pagination state
 * const pagination = { pageIndex: 0, pageSize: 15 };
 * const params = createPaginationParams(pagination.pageIndex, pagination.pageSize);
 * // Returns: { page: 1, per_page: 15 }
 *
 * // Use in API call
 * const response = await apiClient.get('products', {
 *   searchParams: params,
 * }).json();
 */
export function createPaginationParams(
  pageIndex: number,
  pageSize: number,
): { page: number; per_page: number } {
  return {
    page: pageIndex + 1, // TanStack Table uses 0-based, Laravel uses 1-based
    per_page: pageSize,
  };
}

/**
 * Helper functions for working with Laravel pagination metadata.
 * Provides common utilities for checking pagination state and formatting.
 */
export const paginationHelpers = {
  /**
   * Checks if there is a next page available.
   *
   * @param pagination - The Laravel pagination metadata
   * @returns true if there is a next page, false otherwise
   *
   * @example
   * const { data, pagination } = await parsePaginatedResponse(response, schema);
   * if (paginationHelpers.hasNextPage(pagination)) {
   *   // Load next page
   * }
   */
  hasNextPage(pagination: LaravelPaginationMeta): boolean {
    return pagination.current_page < pagination.last_page;
  },

  /**
   * Checks if there is a previous page available.
   *
   * @param pagination - The Laravel pagination metadata
   * @returns true if there is a previous page, false otherwise
   *
   * @example
   * const { data, pagination } = await parsePaginatedResponse(response, schema);
   * if (paginationHelpers.hasPreviousPage(pagination)) {
   *   // Load previous page
   * }
   */
  hasPreviousPage(pagination: LaravelPaginationMeta): boolean {
    return pagination.current_page > 1;
  },

  /**
   * Gets the total number of pages.
   *
   * @param pagination - The Laravel pagination metadata
   * @returns The total number of pages
   *
   * @example
   * const { data, pagination } = await parsePaginatedResponse(response, schema);
   * const totalPages = paginationHelpers.getPageCount(pagination);
   * console.log(`Total pages: ${totalPages}`);
   */
  getPageCount(pagination: LaravelPaginationMeta): number {
    return pagination.last_page;
  },

  /**
   * Checks if the paginated result is empty.
   *
   * @param pagination - The Laravel pagination metadata
   * @returns true if there are no items, false otherwise
   *
   * @example
   * const { data, pagination } = await parsePaginatedResponse(response, schema);
   * if (paginationHelpers.isEmpty(pagination)) {
   *   return <EmptyState />;
   * }
   */
  isEmpty(pagination: LaravelPaginationMeta): boolean {
    return pagination.total === 0;
  },

  /**
   * Gets the range of items displayed in a human-readable format.
   *
   * @param pagination - The Laravel pagination metadata
   * @returns A string like "1-15 of 100" or "0-0 of 0" if empty
   *
   * @example
   * const { data, pagination } = await parsePaginatedResponse(response, schema);
   * const range = paginationHelpers.getRange(pagination);
   * // Returns: "1-15 of 100"
   * console.log(`Showing ${range}`);
   */
  getRange(pagination: LaravelPaginationMeta): string {
    if (pagination.total === 0) return '0-0 of 0';
    const from = pagination.from ?? 0;
    const to = pagination.to ?? 0;
    return `${from}-${to} of ${pagination.total}`;
  },
};

/**
 * Converts TanStack Table pagination state to Laravel pagination query parameters.
 * This is a convenience wrapper around createPaginationParams.
 *
 * @param pagination - The TanStack Table pagination state
 * @returns Query parameters object with `page` and `per_page` for Laravel API
 *
 * @example
 * const [pagination, setPagination] = useState<PaginationState>({
 *   pageIndex: 0,
 *   pageSize: 15,
 * });
 *
 * const params = tablePaginationToLaravel(pagination);
 * // Returns: { page: 1, per_page: 15 }
 *
 * const response = await apiClient.get('products', {
 *   searchParams: params,
 * }).json();
 */
export function tablePaginationToLaravel(pagination: PaginationState): {
  page: number;
  per_page: number;
} {
  return createPaginationParams(pagination.pageIndex, pagination.pageSize);
}

/**
 * Converts Laravel pagination metadata to TanStack Table pagination state.
 * Useful for initializing table pagination from API response.
 *
 * @param pagination - The Laravel pagination metadata
 * @returns TanStack Table pagination state
 *
 * @example
 * const { data, pagination } = await parsePaginatedResponse(response, schema);
 * const tablePagination = laravelToTablePagination(pagination);
 * // Returns: { pageIndex: 0, pageSize: 15 }
 * // (current_page 1 becomes pageIndex 0)
 */
export function laravelToTablePagination(
  pagination: LaravelPaginationMeta,
): PaginationState {
  return {
    pageIndex: pagination.current_page - 1, // Convert 1-based to 0-based
    pageSize: pagination.per_page,
  };
}
