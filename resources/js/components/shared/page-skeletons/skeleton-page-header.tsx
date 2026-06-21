import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SkeletonPageHeaderProps = {
  action?: boolean;
  actions?: number;
  subtitle?: boolean;
  titleClassName?: string;
  className?: string;
};

export function SkeletonPageHeader({
  action,
  actions = action ? 1 : 0,
  subtitle = false,
  titleClassName,
  className,
}: SkeletonPageHeaderProps) {
  const actionCount = action ? 1 : actions;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-2">
        <Skeleton className={cn('h-9 w-48 sm:w-56', titleClassName)} />
        {subtitle ? <Skeleton className="h-4 w-64" /> : null}
      </div>
      {actionCount > 0 ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: actionCount }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-36 rounded-md" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
