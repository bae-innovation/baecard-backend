import { MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DataTableRowActionsMenuProps = {
  label: string;
  children: ReactNode;
};

/** Standard row actions trigger (⋯ menu) used in the Actions column. */
export function DataTableRowActionsMenu({
  label,
  children,
}: DataTableRowActionsMenuProps) {
  return (
    <div
      className="flex justify-center"
      onClick={(event) => event.stopPropagation()}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={label}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 w-52">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
