import type { PaginationState } from '@tanstack/react-table';

export type LaravelPaginator<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    active_template?: number;
    bio?: string | null;
    job_title?: string | null;
    company?: string | null;
    roles?: Array<{ id: number; name: string }>;
};

export type Permission = {
    id: number;
    name: string;
};

import type { AppSettings } from '@/types/app-settings';

export type SharedPageProps = {
    app: AppSettings;
    auth: {
        user: AuthUser | null;
        permissions: Permission[];
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
};

export function paginatorToTableState(
    paginator: LaravelPaginator<unknown>,
): PaginationState {
    return {
        pageIndex: paginator.current_page - 1,
        pageSize: paginator.per_page,
    };
}

export function splitPaginator<T>(paginator: LaravelPaginator<T>) {
    const { data, ...meta } = paginator;

    return {
        data,
        pagination: meta,
        pageCount: paginator.last_page,
    };
}
