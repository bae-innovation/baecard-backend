import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import type { DataTableColumnMeta } from '@/components/shared/data-table/data-table-header';
import { DATA_TABLE_ACTIONS_COLUMN_ID } from '@/components/shared/data-table/data-table-sticky-columns';

type CreateDataTableActionsColumnOptions<TData> = {
  cell: (props: { row: Row<TData> }) => ReactNode;
  meta?: DataTableColumnMeta;
};

/** Right-pinned Actions column shared by all data tables. */
export function createDataTableActionsColumn<TData>({
  cell,
  meta,
}: CreateDataTableActionsColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: DATA_TABLE_ACTIONS_COLUMN_ID,
    header: 'Actions',
    cell,
    enableSorting: false,
    enableHiding: false,
    meta,
  };
}
