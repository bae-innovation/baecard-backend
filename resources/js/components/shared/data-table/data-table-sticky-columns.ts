import type { DataTableColumnMeta } from '@/components/shared/data-table/data-table-header';
import { DATA_TABLE_HEADER_CELL_CLASS } from '@/components/shared/data-table/data-table-constants';
import { cn } from '@/lib/utils';

export const DATA_TABLE_ACTIONS_COLUMN_ID = 'actions';

const stickyRightShadow =
  'shadow-[-6px_0_12px_-8px_rgba(0,0,0,0.12)] dark:shadow-[-6px_0_16px_-8px_rgba(0,0,0,0.45)]';

const stickyLeftShadow =
  'shadow-[4px_0_12px_-8px_rgba(0,0,0,0.12)] dark:shadow-[4px_0_16px_-8px_rgba(0,0,0,0.45)]';

/** Body cell — opaque background so scrolled columns do not bleed through. */
export const DATA_TABLE_STICKY_ACTIONS_BODY_CELL_CLASS = cn(
  'sticky right-0 z-[14] w-[4.5rem] min-w-[4.5rem] max-w-[4.5rem] border-l border-border bg-background p-0.5 text-center align-middle',
  stickyRightShadow,
  'group-hover:bg-muted group-data-[state=selected]:bg-muted',
);

export const DATA_TABLE_STICKY_WIDE_ACTIONS_BODY_CELL_CLASS = cn(
  'sticky right-0 z-[14] min-w-[8.75rem] border-l border-border bg-background px-2 py-1 text-right align-middle',
  stickyRightShadow,
  'group-hover:bg-muted group-data-[state=selected]:bg-muted',
);

/** Header / filter row — pairs with sticky top header in `DataTableHeader`. */
export const DATA_TABLE_STICKY_ACTIONS_HEADER_CELL_CLASS = cn(
  'sticky right-0 border-l',
  DATA_TABLE_HEADER_CELL_CLASS,
  stickyRightShadow,
);

export const DATA_TABLE_STICKY_WIDE_ACTIONS_HEADER_CELL_CLASS = cn(
  'sticky right-0 min-w-[8.75rem] border-l',
  DATA_TABLE_HEADER_CELL_CLASS,
  stickyRightShadow,
);

const stickyLeftBodyCellClass = cn(
  'sticky left-0 z-[14] border-r border-border bg-background',
  stickyLeftShadow,
  'group-hover:bg-muted group-data-[state=selected]:bg-muted',
);

const stickyLeftHeaderCellClass = cn(
  'sticky left-0 border-r',
  DATA_TABLE_HEADER_CELL_CLASS,
  stickyLeftShadow,
);

function hasManualStickyPin(meta?: DataTableColumnMeta): boolean {
  return Boolean(meta?.className?.includes('sticky'));
}

function resolvePinSide(
  columnId: string,
  meta?: DataTableColumnMeta,
): 'left' | 'right' | undefined {
  if (meta?.disableStickyPin || hasManualStickyPin(meta)) return undefined;
  if (meta?.pin) return meta.pin;
  if (columnId === DATA_TABLE_ACTIONS_COLUMN_ID) return 'right';
  return undefined;
}

/** Merged into header and body cells when the column should pin on horizontal scroll. */
export function getDataTableStickyColumnCellClassName(
  columnId: string,
  meta?: DataTableColumnMeta,
  layer: 'header' | 'body' = 'body',
): string | undefined {
  const side = resolvePinSide(columnId, meta);
  if (!side) return undefined;

  if (columnId === DATA_TABLE_ACTIONS_COLUMN_ID) {
    const isWide = meta?.actionsLayout === 'wide';
    return layer === 'header'
      ? isWide
        ? DATA_TABLE_STICKY_WIDE_ACTIONS_HEADER_CELL_CLASS
        : DATA_TABLE_STICKY_ACTIONS_HEADER_CELL_CLASS
      : isWide
        ? DATA_TABLE_STICKY_WIDE_ACTIONS_BODY_CELL_CLASS
        : DATA_TABLE_STICKY_ACTIONS_BODY_CELL_CLASS;
  }

  if (side === 'left') {
    return layer === 'header'
      ? stickyLeftHeaderCellClass
      : stickyLeftBodyCellClass;
  }

  return layer === 'header'
    ? DATA_TABLE_STICKY_ACTIONS_HEADER_CELL_CLASS
    : DATA_TABLE_STICKY_ACTIONS_BODY_CELL_CLASS;
}

/** Default z-index stacking for sticky top header + pinned actions column. */
export function dataTableStickyHeaderCellClassName(
  columnId: string,
  layer: 'title' | 'filter',
): string | undefined {
  if (columnId === DATA_TABLE_ACTIONS_COLUMN_ID) {
    return layer === 'title' ? 'z-[25]' : 'z-[24]';
  }
  return layer === 'title' ? 'z-[12]' : 'z-[11]';
}

export function mergeDataTableStickyHeaderCellClassName(
  columnId: string,
  layer: 'title' | 'filter',
  custom?: (columnId: string, layer: 'title' | 'filter') => string | undefined,
): string | undefined {
  return cn(
    dataTableStickyHeaderCellClassName(columnId, layer),
    custom?.(columnId, layer),
  );
}
