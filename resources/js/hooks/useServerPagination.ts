import type { PaginationState } from '@tanstack/react-table';
import { useQueryStates } from 'nuqs';

import {
  createPaginationSearchParams,
  nuqsToTablePagination,
  tableToNuqsPagination,
  type PaginationSearchParams,
} from '@/utils/nuqs-pagination';

/**
 * Hook for managing server-side pagination state synced with URL parameters.
 * Uses nuqs to persist pagination state in the URL query string.
 *
 * @param defaults - Optional default pagination values
 * @returns Tuple of [paginationState, setPaginationState] similar to useState
 *
 * @example
 * ```tsx
 * const [{ pageIndex, pageSize }, setPagination] = useServerPagination();
 *
 * // Update pagination (automatically syncs to URL)
 * setPagination({ pageIndex: 1, pageSize: 20 });
 *
 * // Or use with TanStack Table
 * const table = useReactTable({
 *   state: {
 *     pagination: { pageIndex, pageSize },
 *   },
 *   onPaginationChange: (updater) => {
 *     const newPagination = typeof updater === 'function'
 *       ? updater({ pageIndex, pageSize })
 *       : updater;
 *     setPagination(tableToNuqsPagination(newPagination));
 *   },
 * });
 * ```
 */
export function useServerPagination(defaults?: {
  pageIndex?: number;
  pageSize?: number;
}): [
  PaginationState,
  (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => void,
] {
  const searchParams = createPaginationSearchParams(defaults);
  const [nuqsState, setNuqsState] = useQueryStates(searchParams);

  // Convert nuqs state to TanStack Table PaginationState
  const paginationState = nuqsToTablePagination(nuqsState);

  // Wrapper to convert table pagination state to nuqs state
  const setPagination = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    if (typeof updater === 'function') {
      setNuqsState((prev) => {
        const prevTableState = nuqsToTablePagination(prev);
        const newTableState = updater(prevTableState);
        return tableToNuqsPagination(newTableState);
      });
    } else {
      setNuqsState(tableToNuqsPagination(updater));
    }
  };

  return [paginationState, setPagination];
}

/**
 * Type for the pagination search params used by useServerPagination.
 * Can be used to create the validateSearch schema in routes.
 */
export type ServerPaginationSearchParams = PaginationSearchParams;
