import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>;
    title: string;
    /** Header content alignment (should match body cells in the column). */
    align?: 'start' | 'end' | 'center';
  };

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = 'start',
}: DataTableColumnHeaderProps<TData, TValue>) {
  const end = align === 'end';
  const center = align === 'center';

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          'flex h-full w-full min-w-0 items-center',
          center && 'justify-center text-center',
          !center && end && 'justify-end text-right',
          !center && !end && 'justify-start text-left',
          className,
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-center gap-2',
        center && 'justify-center text-center',
        !center && end && 'justify-end',
        !center && !end && 'justify-start',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className={cn(
              'h-full data-[state=open]:bg-accent',
              center && '-mx-3 justify-center',
              !center && end && '-mr-3 justify-end',
              !center && !end && '-ml-3 justify-start',
            )}
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={center ? 'center' : end ? 'end' : 'start'}>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
