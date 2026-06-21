import { createStandardSchemaV1, parseAsIndex, parseAsInteger } from 'nuqs';

import type { PaginationState } from '@tanstack/react-table';

/**
 * Default pagination values
 */
const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Creates nuqs parsers for pagination search parameters.
 * Returns parsers for `pageIndex` (0-based) and `pageSize`.
 *
 * @param defaults - Optional default values (defaults to pageIndex: 0, pageSize: 10)
 * @returns Object with `pageIndex` and `pageSize` parsers for use with `useQueryStates`
 *
 * @example
 * ```tsx
 * const searchParams = createPaginationSearchParams();
 *
 * export const Route = createFileRoute('/orders')({
 *   validateSearch: createStandardSchemaV1(searchParams, {
 *     partialOutput: true,
 *   }),
 * });
 *
 * function Component() {
 *   const [{ pageIndex, pageSize }, setPagination] = useQueryStates(searchParams);
 *   // ...
 * }
 * ```
 */
export function createPaginationSearchParams(defaults?: {
  pageIndex?: number;
  pageSize?: number;
}) {
  return {
    pageIndex: parseAsIndex.withDefault(
      defaults?.pageIndex ?? DEFAULT_PAGE_INDEX,
    ),
    pageSize: parseAsInteger.withDefault(
      defaults?.pageSize ?? DEFAULT_PAGE_SIZE,
    ),
  };
}

/**
 * Type for pagination search params created by `createPaginationSearchParams`.
 * Useful for type inference in components.
 */
export type PaginationSearchParams = ReturnType<
  typeof createPaginationSearchParams
>;

/**
 * Creates a TanStack Router validateSearch schema from pagination search params.
 * This integrates nuqs pagination with TanStack Router's type-safe routing.
 *
 * @param searchParams - Pagination search params from `createPaginationSearchParams`
 * @returns A Standard Schema V1 validator for use in route's `validateSearch`
 *
 * @example
 * ```tsx
 * const searchParams = createPaginationSearchParams();
 *
 * export const Route = createFileRoute('/orders')({
 *   validateSearch: createPaginationSearchSchema(searchParams),
 * });
 * ```
 */
export function createPaginationSearchSchema(
  searchParams: PaginationSearchParams,
) {
  return createStandardSchemaV1(searchParams, {
    partialOutput: true,
  });
}

/**
 * Converts nuqs pagination state to TanStack Table PaginationState.
 * Useful when using nuqs with TanStack Table.
 *
 * @param nuqsState - The pagination state from `useQueryStates`
 * @returns TanStack Table PaginationState
 *
 * @example
 * ```tsx
 * const [{ pageIndex, pageSize }, setPagination] = useQueryStates(searchParams);
 * const tablePagination = nuqsToTablePagination({ pageIndex, pageSize });
 * ```
 */
export function nuqsToTablePagination(nuqsState: {
  pageIndex: number;
  pageSize: number;
}): PaginationState {
  return {
    pageIndex: nuqsState.pageIndex,
    pageSize: nuqsState.pageSize,
  };
}

/**
 * Converts TanStack Table PaginationState to nuqs pagination state.
 * Useful when updating pagination from table events.
 *
 * @param tablePagination - The TanStack Table PaginationState
 * @returns nuqs pagination state
 *
 * @example
 * ```tsx
 * const [{ pageIndex, pageSize }, setPagination] = useQueryStates(searchParams);
 *
 * const table = useReactTable({
 *   onPaginationChange: (updater) => {
 *     const newPagination = typeof updater === 'function'
 *       ? updater({ pageIndex, pageSize })
 *       : updater;
 *     setPagination(tableToNuqsPagination(newPagination));
 *   },
 * });
 * ```
 */
export function tableToNuqsPagination(tablePagination: PaginationState): {
  pageIndex: number;
  pageSize: number;
} {
  return {
    pageIndex: tablePagination.pageIndex,
    pageSize: tablePagination.pageSize,
  };
}
