import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<_TData> {
    /** Allow feature-specific table meta handlers across the app. */
    [key: string]: unknown;

    onEditBlacklistedUser?: (id: number) => void;
    onViewDetails?: (...args: unknown[]) => void;
    onEditDetails?: (...args: unknown[]) => void;
    handleViewUserDetails?: (...args: unknown[]) => void;
    onEditLeave?: (id: number) => void;
  }
}
