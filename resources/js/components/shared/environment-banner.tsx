import { AlertTriangle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const bannerConfig = {
  development: {
    bgColor: 'bg-amber-200',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    label: 'Development',
  } as const,
  staging: {
    bgColor: 'bg-purple-200',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    label: 'Staging',
  } as const,
  production: {
    bgColor: 'bg-green-200',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    label: 'Production',
  } as const,
} as const;

// Standard flat banner
const positionClasses = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'corner-right': 'top-0 right-0', // Fallback if ribbon style not used
  'corner-left': 'top-0 left-0', // Fallback if ribbon style not used
} as const;

type Environment = 'development' | 'staging' | 'production';
type Position =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'corner-right'
  | 'corner-left';

type EnvironmentBannerProps = {
  environment?: Environment;
  className?: string;
  position?: Position;
  style?: 'flat' | 'ribbon';
};

function useEnvironment(environment?: Environment) {
  const [currentEnv, setCurrentEnv] = useState<Environment>(
    environment || 'production',
  );

  const detectEnvironment = useCallback(
    function () {
      if (environment) return;

      const hostname = window.location.hostname;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        setCurrentEnv('development');
      } else if (
        hostname.includes('staging') ||
        hostname.includes('test') ||
        hostname.includes('dev')
      ) {
        setCurrentEnv('staging');
      } else {
        setCurrentEnv('production');
      }
    },
    [environment],
  );

  // Auto-detect environment if not explicitly provided
  useEffect(detectEnvironment, [detectEnvironment]);

  return currentEnv;
}

export function EnvironmentBanner({
  environment,
  className,
  position = 'top-right',
  style = 'flat',
}: EnvironmentBannerProps) {
  const currentEnv = useEnvironment(environment);

  // Don't show banner in production
  if (currentEnv === 'production') return null;

  const config = bannerConfig[currentEnv];

  // If using corner ribbon style
  if (
    style === 'ribbon' &&
    (position === 'corner-right' || position === 'corner-left')
  ) {
    const isLeft = position === 'corner-left';

    return (
      <div
        className={cn(
          'pointer-events-none fixed z-50 h-32 w-32 overflow-hidden', // Increased size
          isLeft ? 'left-0 top-0' : 'right-0 top-0',
          className,
        )}
      >
        <div
          className={cn(
            'pointer-events-auto absolute transform py-1 text-center text-sm font-medium shadow-md',
            config.bgColor,
            config.textColor,
            config.borderColor,
            'border-b',
            isLeft
              ? '-left-12 top-8 w-48 -rotate-45' // Adjusted positioning
              : '-right-12 top-8 w-48 rotate-45', // Adjusted positioning
          )}
        >
          {config.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-50 m-4 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium shadow-md',
        config.bgColor,
        config.textColor,
        config.borderColor,
        positionClasses[position],
        className,
      )}
    >
      <AlertTriangle className="size-4" />
      {config.label} Environment
    </div>
  );
}
