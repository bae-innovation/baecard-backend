import { router } from '@inertiajs/react';
import type { PaginationState } from '@tanstack/react-table';
import { useCallback } from 'react';

import { paginatorToTableState, type LaravelPaginator } from '@/types/inertia';

export function useInertiaPagination<T>(
    paginator: LaravelPaginator<T>,
    only?: string[],
) {
    const pagination = paginatorToTableState(paginator);

    const setPagination = useCallback(
        (
            updater:
                | PaginationState
                | ((prev: PaginationState) => PaginationState),
        ) => {
            const next =
                typeof updater === 'function'
                    ? updater(pagination)
                    : updater;

            router.get(
                window.location.pathname,
                {
                    page: next.pageIndex + 1,
                    per_page: next.pageSize,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only,
                },
            );
        },
        [only, pagination],
    );

    const reload = useCallback(() => {
        router.reload({ only });
    }, [only]);

    return {
        data: paginator.data,
        pagination,
        pageCount: paginator.last_page,
        setPagination,
        reload,
        isFetching: false,
    };
}
