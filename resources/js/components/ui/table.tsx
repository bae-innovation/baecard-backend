import * as React from "react"

import { useNestedScrollChain } from "@/hooks/use-nested-scroll-chain"
import { composeRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"

export type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  /** Classes for the scroll wrapper around `<table>` (default: overflow-auto). */
  containerClassName?: string;
  /** Inline styles for the scroll wrapper around `<table>`. */
  containerStyle?: React.CSSProperties;
  /** Ref for the scroll wrapper around `<table>`. */
  containerRef?: React.Ref<HTMLDivElement>;
  /**
   * When true (default), wheel at scroll top/bottom chains to the page scroll.
   * Set false when using DataTableLayout (it handles chaining once).
   */
  scrollChain?: boolean;
  /**
   * When true (default), caps table body height for in-table scrolling on list pages.
   * Set false in dialogs and compact embeds.
   */
  bounded?: boolean;
  /**
   * When false, renders `<table>` only (no scroll wrapper). Use when the page scrolls
   * and horizontal overflow is handled by a parent (`overflow-x-auto overflow-y-clip`).
   */
  scrollContainer?: boolean;
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      containerStyle,
      containerRef,
      scrollChain = true,
      bounded = true,
      scrollContainer = true,
      ...props
    },
    ref,
  ) => {
    const scrollChainRef = useNestedScrollChain<HTMLDivElement>();
    const mergedContainerRef = composeRefs(
      scrollChain ? scrollChainRef : undefined,
      containerRef,
    );

    const tableElement = (
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    );

    if (!scrollContainer) {
      return tableElement;
    }

    return (
      <div
        ref={mergedContainerRef}
        className={cn(
          "relative w-full min-h-0",
          bounded
            ? "max-h-[calc(100dvh-11rem)] overflow-auto scroll-smooth overscroll-contain"
            : "overflow-x-auto overflow-y-clip",
          containerClassName,
        )}
        style={containerStyle}
      >
        {tableElement}
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const tableCellDividerClass = 'border-r border-border/60 last:border-r-0';

const tableHeadInnerClass =
  'flex h-10 w-full min-w-0 items-center px-2 [.text-center_&]:justify-center [.text-right_&]:justify-end';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      tableCellDividerClass,
      "h-10 p-0 text-left align-middle font-medium text-muted-foreground [vertical-align:middle]",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    <div className={tableHeadInnerClass}>{children}</div>
  </th>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      tableCellDividerClass,
      "p-2 align-middle [vertical-align:middle] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableHeadInnerClass,
}
