import { cn } from '@/lib/utils';

type PageSkeletonShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Use `p-4` padding like marketing list pages */
  padded?: boolean;
};

export function PageSkeletonShell({
  children,
  className,
  padded = false,
}: PageSkeletonShellProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      className={cn(
        'container mx-auto flex min-h-0 flex-1 flex-col gap-6 overflow-hidden py-6',
        padded && 'gap-4 p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
