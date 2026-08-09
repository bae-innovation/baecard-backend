import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorPageShellProps = {
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: 'violet' | 'amber' | 'rose';
  message?: string | null;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  children?: ReactNode;
};

const toneStyles = {
  violet: {
    glow: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    code: 'from-violet-600 to-indigo-500',
  },
  amber: {
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    code: 'from-amber-500 to-orange-500',
  },
  rose: {
    glow: 'from-rose-500/20 via-red-500/10 to-transparent',
    icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    code: 'from-rose-500 to-red-500',
  },
} as const;

export function ErrorPageShell({
  code,
  title,
  description,
  icon: Icon,
  tone = 'violet',
  message,
  primaryAction,
  secondaryAction,
  children,
}: ErrorPageShellProps) {
  const styles = toneStyles[tone];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br',
          styles.glow,
        )}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-violet-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="rounded-2xl border bg-card/80 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <div className="mb-6 flex items-center gap-4">
            <div
              className={cn(
                'flex size-14 shrink-0 items-center justify-center rounded-2xl',
                styles.icon,
              )}
            >
              <Icon className="size-7" aria-hidden />
            </div>
            <div>
              <p
                className={cn(
                  'bg-gradient-to-r bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl',
                  styles.code,
                )}
              >
                {code}
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>

          {message ? (
            <p className="mt-4 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          {children}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {primaryAction ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
