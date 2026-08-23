import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

import { AppBrandLogo } from '@/components/shared/app-brand-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { resolveUserAvatarUrl } from '@/features/account/lib/user-avatar';
import { useAuth } from '@/hooks/useAuth';
import { OwnerMenuSheet } from '@/owner/components/owner-menu-sheet';

function userInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function OwnerTopBar() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const initials = userInitials(user.name);
  const avatarUrl = resolveUserAvatarUrl(user);

  return (
    <header
      className="sticky top-0 z-40 flex h-[3.25rem] shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <OwnerMenuSheet />
      <div className="min-w-0 flex-1 flex justify-center sm:justify-start">
        <AppBrandLogo variant="sidebar" imageClassName="h-7 w-auto max-w-[120px]" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage src={avatarUrl} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/user/account">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.post('/logout')}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
