import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ProfilePageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  hasCover: boolean;
  variant?: 'light' | 'dark' | 'modern-light' | 'modern-dark';
};

const variantStyles = {
  light: {
    shell: 'bg-[#f5efe6] text-stone-900',
    avatarBorder: 'border-[#f5efe6]',
  },
  dark: {
    shell: 'bg-stone-950 text-white',
    avatarBorder: 'border-stone-950',
  },
  'modern-light': {
    shell: 'bg-slate-100 text-slate-900',
    avatarBorder: 'border-white',
  },
  'modern-dark': {
    shell: 'bg-zinc-950 text-white',
    avatarBorder: 'border-zinc-950',
  },
} as const;

export function ProfilePageShell({
  children,
  className,
  contentClassName,
  hasCover,
  variant = 'light',
}: ProfilePageShellProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('min-h-svh pb-[env(safe-area-inset-bottom,0px)]', styles.shell, className)}>
      <div
        className={cn(
          'mx-auto max-w-lg px-4 pb-10 sm:px-6',
          hasCover ? 'pt-6' : 'pt-8',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function profileAvatarOverlapClass(hasCover: boolean) {
  return hasCover ? '-mt-12' : '';
}

export function profileAvatarBorderClass(variant: ProfilePageShellProps['variant']) {
  return variantStyles[variant ?? 'light'].avatarBorder;
}
