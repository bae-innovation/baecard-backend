import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** @deprecated Legacy per-page colors now resolve to the appearance accent. */
export type PageTitleColor =
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'orange'
  | 'amber'
  | 'emerald'
  | 'teal'
  | 'violet'
  | 'pink'
  | 'rose'
  | 'red'
  | 'indigo'
  | 'sky'
  | 'green'
  | 'yellow'
  | 'slate';

export type PageTitleVariant = 'accent' | 'muted' | 'destructive';

const variantStyles: Record<PageTitleVariant, { bg: string; icon: string }> = {
  accent: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
  },
  muted: {
    bg: 'bg-muted',
    icon: 'text-muted-foreground',
  },
  destructive: {
    bg: 'bg-destructive/10',
    icon: 'text-destructive',
  },
};

type PageTitleProps = {
  title: string;
  icon: LucideIcon;
  /** @deprecated Use `variant`. Any legacy value follows the appearance accent. */
  color?: PageTitleColor | PageTitleVariant;
  variant?: PageTitleVariant;
  description?: string;
  className?: string;
  headingClassName?: string;
  as?: 'h1' | 'h2';
  compact?: boolean;
};

function resolveVariant(
  color?: PageTitleColor | PageTitleVariant,
  variant?: PageTitleVariant,
): PageTitleVariant {
  if (variant) {
    return variant;
  }

  if (color === 'muted' || color === 'destructive') {
    return color;
  }

  return 'accent';
}

export function PageTitle({
  title,
  icon: Icon,
  color,
  variant,
  description,
  className,
  headingClassName,
  as: Heading = 'h1',
  compact = false,
}: PageTitleProps) {
  const styles = variantStyles[resolveVariant(color, variant)];

  return (
    <div className={cn('flex items-center', compact ? 'gap-2' : 'gap-3', className)}>
      <div className={cn(compact ? 'rounded-md p-1.5' : 'rounded-lg p-2', styles.bg)}>
        <Icon className={cn(compact ? 'size-5' : 'size-6', styles.icon)} aria-hidden />
      </div>
      <div className="min-w-0">
        <Heading
          className={cn(
            compact ? 'text-xl font-semibold tracking-tight' : 'text-3xl font-bold tracking-tight',
            headingClassName,
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              'text-muted-foreground',
              compact ? 'mt-0.5 text-xs' : 'mt-1 text-sm md:text-base',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
