import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconClassName = 'size-4 shrink-0';

type TableDropdownActionProps = ComponentProps<typeof DropdownMenuItem> & {
  icon: LucideIcon;
  iconClassName?: string;
};

/** Dropdown row action with a leading Lucide icon (edit, copy, delete, view, etc.). */
export function TableDropdownAction({
  icon: Icon,
  children,
  className,
  iconClassName: iconCn,
  ...props
}: TableDropdownActionProps) {
  return (
    <DropdownMenuItem className={cn('gap-2', className)} {...props}>
      <Icon className={cn(iconClassName, iconCn)} aria-hidden />
      {children}
    </DropdownMenuItem>
  );
}

/** className for Link children inside DropdownMenuItem asChild action rows. */
export const tableDropdownLinkClassName =
  'flex cursor-pointer items-center gap-2';
