import { RefreshCw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type OwnerAppSearchRowProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
};

export function OwnerAppSearchRow({
  value,
  onChange,
  placeholder = 'Search…',
  onRefresh,
  isRefreshing = false,
  className,
}: OwnerAppSearchRowProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative min-w-0 flex-1">
        <Search
          className="owner-search-icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="owner-search-input"
        />
      </div>
      {onRefresh ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="owner-search-refresh shrink-0"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh"
        >
          <RefreshCw className={cn('owner-icon-inline !mr-0', isRefreshing && 'animate-spin')} />
        </Button>
      ) : null}
    </div>
  );
}
