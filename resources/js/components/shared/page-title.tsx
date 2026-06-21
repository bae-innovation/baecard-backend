import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

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

const colorStyles: Record<PageTitleColor, { bg: string; icon: string }> = {
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900',
    icon: 'text-cyan-700 dark:text-cyan-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: 'text-blue-700 dark:text-blue-400',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    icon: 'text-orange-700 dark:text-orange-400',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900',
    icon: 'text-amber-700 dark:text-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900',
    icon: 'text-emerald-700 dark:text-emerald-400',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-950',
    icon: 'text-teal-700 dark:text-teal-400',
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-900',
    icon: 'text-violet-700 dark:text-violet-400',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/50',
    icon: 'text-pink-700 dark:text-pink-400',
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-900',
    icon: 'text-rose-700 dark:text-rose-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'text-red-700 dark:text-red-400',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    icon: 'text-indigo-700 dark:text-indigo-400',
  },
  sky: {
    bg: 'bg-sky-100 dark:bg-sky-950',
    icon: 'text-sky-700 dark:text-sky-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900',
    icon: 'text-green-700 dark:text-green-400',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    icon: 'text-yellow-700 dark:text-yellow-400',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-900',
    icon: 'text-slate-700 dark:text-slate-400',
  },
};

type PageTitleProps = {
  title: string;
  icon: LucideIcon;
  color?: PageTitleColor;
  description?: string;
  className?: string;
  headingClassName?: string;
  as?: 'h1' | 'h2';
};

export function PageTitle({
  title,
  icon: Icon,
  color = 'blue',
  description,
  className,
  headingClassName,
  as: Heading = 'h1',
}: PageTitleProps) {
  const styles = colorStyles[color];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('rounded-lg p-2', styles.bg)}>
        <Icon className={cn('size-6', styles.icon)} aria-hidden />
      </div>
      <div className="min-w-0">
        <Heading
          className={cn('text-3xl font-bold tracking-tight', headingClassName)}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
