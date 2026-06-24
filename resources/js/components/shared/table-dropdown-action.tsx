import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
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
  asChild,
  ...props
}: TableDropdownActionProps) {
  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        'TableDropdownAction with asChild requires a single React element child.',
      );
    }

    const child = children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;

    return (
      <DropdownMenuItem asChild className={cn('gap-2', className)} {...props}>
        {React.cloneElement(child, {
          className: cn(tableDropdownLinkClassName, child.props.className),
          children: (
            <>
              <Icon className={cn(iconClassName, iconCn)} aria-hidden />
              {child.props.children}
            </>
          ),
        })}
      </DropdownMenuItem>
    );
  }

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
