import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { LayoutDashboard, Plus } from 'lucide-react';
import * as React from 'react';

import {
  DataTableFooter,
  DataTableLayout,
  DataTableToolbar,
  DataTableViewOptions,
} from '@/components/shared/data-table';
import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/Layouts/DashboardLayout';

type ShowcaseRow = {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  updatedAt: string;
};

const SAMPLE_ROWS: ShowcaseRow[] = [
  { id: '1', name: 'Example record A', status: 'active', updatedAt: '2026-06-01' },
  { id: '2', name: 'Example record B', status: 'draft', updatedAt: '2026-06-02' },
  { id: '3', name: 'Example record C', status: 'archived', updatedAt: '2026-06-03' },
  { id: '4', name: 'Example record D', status: 'active', updatedAt: '2026-06-04' },
  { id: '5', name: 'Example record E', status: 'draft', updatedAt: '2026-06-05' },
];

const columnHelper = createColumnHelper<ShowcaseRow>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">{getValue()}</span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue();
      const variant =
        status === 'active'
          ? 'default'
          : status === 'draft'
            ? 'secondary'
            : 'outline';
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
  }),
];

function DashboardShowcasePage() {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data: SAMPLE_ROWS,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Design Showcase"
          icon={LayoutDashboard}
          color="indigo"
          description="Starter template demonstrating shared admin layout, page header, buttons, and data table patterns."
        />
        <Button type="button" className="shrink-0">
          <Plus className="size-4" />
          Primary action
        </Button>
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search records..."
                className="h-9 w-full max-w-xs"
                aria-label="Search showcase records"
              />
            }
            end={<DataTableViewOptions table={table} />}
          />
        }
        footer={<DataTableFooter table={table} />}
      />
    </div>
  );
}

export default function Index() {
  return <DashboardShowcasePage />;
}

Index.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
