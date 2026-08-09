import { KeyRound, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Role } from '@/features/roles/schemas/role.schema';

type RoleDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
};

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function RoleDetailDialog({ open, onOpenChange, role }: RoleDetailDialogProps) {
  const permissions = role?.permissions ?? [];
  const isProtected = Boolean(role?.is_protected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-violet-600" aria-hidden />
            {role?.name ?? 'Role details'}
          </DialogTitle>
          <DialogDescription>
            View role metadata and assigned permissions.
          </DialogDescription>
        </DialogHeader>

        {role ? (
          <div className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Role name
                </dt>
                <dd className="flex items-center gap-2 text-sm font-medium">
                  {role.name}
                  {isProtected ? (
                    <Badge variant="secondary" className="text-xs">
                      Protected
                    </Badge>
                  ) : null}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Guard
                </dt>
                <dd className="font-mono text-sm text-muted-foreground">
                  {role.guard_name ?? 'sanctum'}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Permissions
                </dt>
                <dd className="text-sm">{role.permissions_count ?? permissions.length}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Created
                </dt>
                <dd className="text-sm text-muted-foreground">{formatDate(role.created_at)}</dd>
              </div>
            </dl>

            <Separator />

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-muted-foreground" aria-hidden />
                <h3 className="text-sm font-semibold">Assigned permissions</h3>
              </div>
              {permissions.length > 0 ? (
                <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto rounded-md border bg-muted/20 p-3">
                  {permissions.map((permission) => (
                    <Badge
                      key={permission.id}
                      variant="outline"
                      className="font-mono text-[11px] font-normal"
                    >
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No permissions assigned to this role.
                </p>
              )}
            </section>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
