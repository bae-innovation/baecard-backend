import type * as React from 'react';

import { cn } from '@/lib/utils';

type DataTableToolbarProps = {
  /** Search inputs, faceted filters, and similar controls. */
  start?: React.ReactNode;
  /** Actions, view options, export, refresh, etc. */
  end?: React.ReactNode;
  className?: string;
};

/**
 * Responsive toolbar shell for list tables: stacks on narrow viewports,
 * aligns filters and actions in a row from `sm` and up.
 */
export function DataTableToolbar({
  start,
  end,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      {start ? (
        <div className="flex w-full min-w-0 flex-1 flex-wrap items-center gap-2 sm:w-auto">
          {start}
        </div>
      ) : null}
      {end ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {end}
        </div>
      ) : null}
    </div>
  );
}
