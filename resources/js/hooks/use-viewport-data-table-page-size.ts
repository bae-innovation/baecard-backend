import * as React from 'react';

const DEFAULT_MIN_PAGE_SIZE = 10;
const DEFAULT_MAX_PAGE_SIZE = 100;
const DEFAULT_TABLE_HEADER_PX = 80;
const DEFAULT_ROW_HEIGHT_PX = 52;
const DEFAULT_FOOTER_RESERVE_PX = 72;
const DEFAULT_VIEWPORT_PADDING_PX = 16;

export type UseViewportDataTablePageSizeOptions = {
  /** Top of the bordered table block (used with viewport height). */
  tableAnchorRef: React.RefObject<HTMLElement | null>;
  /** Pagination bar below the table; measured when present. */
  footerAnchorRef?: React.RefObject<HTMLElement | null>;
  minPageSize?: number;
  maxPageSize?: number;
  tableHeaderPx?: number;
  rowHeightPx?: number;
  /** Fallback when `footerAnchorRef` is not mounted yet. */
  footerReservePx?: number;
  viewportPaddingPx?: number;
  /** Re-run layout when chrome above the table changes height. */
  layoutDeps?: React.DependencyList;
  /** When false, keeps `minPageSize` and skips viewport measurement (e.g. page scroll layout). */
  enabled?: boolean;
};

export type ViewportDataTablePageSizeResult = {
  pageSize: number;
  /** Max pixel height for tbody scroll area (excludes thead). */
  maxBodyHeightPx: number;
  tableHeaderPx: number;
  rowHeightPx: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function useViewportDataTablePageSize({
  tableAnchorRef,
  footerAnchorRef,
  minPageSize = DEFAULT_MIN_PAGE_SIZE,
  maxPageSize = DEFAULT_MAX_PAGE_SIZE,
  tableHeaderPx: tableHeaderPxFallback = DEFAULT_TABLE_HEADER_PX,
  rowHeightPx: rowHeightPxFallback = DEFAULT_ROW_HEIGHT_PX,
  footerReservePx = DEFAULT_FOOTER_RESERVE_PX,
  viewportPaddingPx = DEFAULT_VIEWPORT_PADDING_PX,
  layoutDeps = [],
  enabled = true,
}: UseViewportDataTablePageSizeOptions): ViewportDataTablePageSizeResult {
  const [metrics, setMetrics] = React.useState<ViewportDataTablePageSizeResult>(
    () => ({
      pageSize: minPageSize,
      maxBodyHeightPx: minPageSize * rowHeightPxFallback,
      tableHeaderPx: tableHeaderPxFallback,
      rowHeightPx: rowHeightPxFallback,
    }),
  );

  const recompute = React.useCallback(() => {
    if (!enabled) {
      setMetrics((prev) => {
        if (prev.pageSize === minPageSize) return prev;
        return {
          pageSize: minPageSize,
          maxBodyHeightPx: minPageSize * rowHeightPxFallback,
          tableHeaderPx: tableHeaderPxFallback,
          rowHeightPx: rowHeightPxFallback,
        };
      });
      return;
    }

    const anchor = tableAnchorRef.current;
    if (!anchor) return;

    const thead = anchor.querySelector('thead');
    const firstBodyRow = anchor.querySelector('tbody tr');

    const measuredHeader = thead?.getBoundingClientRect().height;
    const measuredRow = firstBodyRow?.getBoundingClientRect().height;

    const tableHeaderPx =
      measuredHeader && measuredHeader > 0
        ? Math.ceil(measuredHeader)
        : tableHeaderPxFallback;
    const rowHeightPx =
      measuredRow && measuredRow > 0
        ? Math.ceil(measuredRow)
        : rowHeightPxFallback;

    const anchorTop = anchor.getBoundingClientRect().top;
    const measuredFooter =
      footerAnchorRef?.current?.getBoundingClientRect().height;
    const footerPx =
      measuredFooter && measuredFooter > 0 ? measuredFooter : footerReservePx;

    // Prefer flex-allocated slot height (table block with flex-1 + min-h-0).
    const flexSlotHeight = anchor.clientHeight;
    const viewportHeight = Math.max(
      0,
      window.innerHeight - anchorTop - footerPx - viewportPaddingPx,
    );
    const layoutHeight =
      flexSlotHeight > tableHeaderPxFallback ? flexSlotHeight : viewportHeight;

    const availableBody = Math.max(0, layoutHeight - tableHeaderPx);
    const pageSize = clamp(
      Math.floor(availableBody / rowHeightPx),
      minPageSize,
      maxPageSize,
    );
    /** Match the real scroll body area so the table fills its flex slot. */
    const maxBodyHeightPx = availableBody;

    setMetrics((prev) => {
      if (
        prev.pageSize === pageSize &&
        prev.maxBodyHeightPx === maxBodyHeightPx &&
        prev.tableHeaderPx === tableHeaderPx &&
        prev.rowHeightPx === rowHeightPx
      ) {
        return prev;
      }
      return { pageSize, maxBodyHeightPx, tableHeaderPx, rowHeightPx };
    });
  }, [
    enabled,
    footerAnchorRef,
    footerReservePx,
    maxPageSize,
    minPageSize,
    rowHeightPxFallback,
    tableAnchorRef,
    tableHeaderPxFallback,
    viewportPaddingPx,
  ]);

  React.useLayoutEffect(() => {
    recompute();
    if (!enabled) return;

    const anchor = tableAnchorRef.current;
    if (!anchor) return;

    const ro = new ResizeObserver(() => recompute());
    ro.observe(anchor);
    const thead = anchor.querySelector('thead');
    const tbody = anchor.querySelector('tbody');
    if (thead) ro.observe(thead);
    if (tbody) ro.observe(tbody);
    const footerEl = footerAnchorRef?.current;
    if (footerEl) ro.observe(footerEl);

    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layoutDeps are intentional triggers
  }, [enabled, recompute, tableAnchorRef, ...layoutDeps]);

  return metrics;
}
