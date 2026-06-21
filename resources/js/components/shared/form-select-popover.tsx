import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type FormSelectOption = {
  value: string;
  label: string;
};

export type FormSelectPopoverProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'type' | 'value' | 'onChange'
> & {
  id?: string;
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  error?: string;
  triggerClassName?: string;
};

export const FormSelectPopover = React.forwardRef<
  HTMLButtonElement,
  FormSelectPopoverProps
>(function FormSelectPopover(
  {
    id,
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Select…',
    emptyText = 'No options.',
    isLoading = false,
    error,
    disabled,
    className,
    triggerClassName,
    ...buttonProps
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="grid min-w-0 gap-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error ? true : undefined}
            variant="outline"
            disabled={disabled || isLoading}
            {...buttonProps}
            className={cn(
              'h-9 w-full justify-between rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm font-normal shadow-sm ring-offset-background focus-visible:ring-1 focus-visible:ring-ring',
              !selected && 'text-muted-foreground',
              error && 'border-destructive',
              triggerClassName,
              className,
            )}
          >
            <span className="line-clamp-1">
              {isLoading ? 'Loading…' : (selected?.label ?? placeholder)}
            </span>
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 duration-150 ease-out animate-in fade-in-0 zoom-in-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          align="start"
        >
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="space-y-2 p-2" aria-busy="true">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        className="min-h-9 text-sm"
                        onSelect={() => {
                          onValueChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4 shrink-0',
                            value === opt.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

FormSelectPopover.displayName = 'FormSelectPopover';
