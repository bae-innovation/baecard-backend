import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  getCountryCallingCodeOptions,
  toCountryCode,
} from '@/features/profile/lib/social-phone';
import { cn } from '@/lib/utils';

type CountryCallingCodeSelectProps = {
  value?: string;
  onChange: (country: string) => void;
  disabled?: boolean;
};

export function CountryCallingCodeSelect({
  value,
  onChange,
  disabled,
}: CountryCallingCodeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const options = React.useMemo(() => getCountryCallingCodeOptions(), []);
  const selected = options.find((option) => option.country === toCountryCode(value)) ?? options[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Country calling code"
          disabled={disabled}
          className="h-9 w-24 shrink-0 justify-between px-2 font-normal"
        >
          <span>+{selected?.callingCode}</span>
          <ChevronsUpDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country or code" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.country}
                  value={option.searchValue}
                  onSelect={() => {
                    onChange(option.country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      option.country === selected?.country ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="min-w-14 font-medium">+{option.callingCode}</span>
                  <span className="truncate text-muted-foreground">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
