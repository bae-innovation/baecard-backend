import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLE_COLORS: Record<string, string> = {
  SuperAdmin:
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
  Admin:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  Marketing:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  User: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
};

type RoleBadgesProps = {
  roles: readonly string[];
  className?: string;
};

export function RoleBadges({ roles, className }: RoleBadgesProps) {
  if (roles.length === 0) {
    return (
      <Badge variant="outline" className={cn('font-normal', className)}>
        No role
      </Badge>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {roles.map((role) => (
        <Badge
          key={role}
          variant="outline"
          className={cn('font-medium', ROLE_COLORS[role])}
        >
          {role}
        </Badge>
      ))}
    </div>
  );
}
