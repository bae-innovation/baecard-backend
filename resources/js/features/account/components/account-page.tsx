import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BadgeCheck,
  CalendarDays,
  KeyRound,
  Loader2,
  Mail,
  MailCheck,
  Phone,
  Shield,
} from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormSection } from '@/components/shared/form-section';
import { PageTitle } from '@/components/shared/page-title';
import { RoleBadges } from '@/components/shared/role-badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AccountCardLinkSection } from '@/features/account/components/account-card-link-section';
import { resolveUserAvatarUrl } from '@/features/account/lib/user-avatar';
import { resolveUserCardCode } from '@/features/account/lib/user-card-code';
import {
  type AccountUser,
  type UpdateAccountPasswordFormValues,
  updateAccountPasswordFormSchema,
} from '@/features/account/schemas/account.schema';
import { getUserRoleNames } from '@/features/users/schemas/user.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';
import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';
import { OwnerFormSection } from '@/owner/components/owner-form-section';
import { useOwnerAppShell } from '@/owner/hooks/use-owner-app-shell';
import { AccountAppPage } from '@/owner/pages/account-app-page';

type AccountPageProps = {
  user: AccountUser;
};

export type AccountPageVariant = 'dashboard' | 'owner-app';

function userInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function DetailField({
  label,
  value,
  className,
  app = false,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  app?: boolean;
}) {
  const empty = value == null || value === '' || value === '—';

  return (
    <div className={cn('space-y-1', className)}>
      <dt
        className={cn(
          'font-medium uppercase tracking-wide text-muted-foreground',
          app ? 'text-sm' : 'text-xs',
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          app ? 'text-base leading-relaxed' : 'text-sm leading-relaxed',
          empty && 'text-muted-foreground',
        )}
      >
        {empty ? '—' : value}
      </dd>
    </div>
  );
}

function ProfileSummaryCard({ user, app = false }: { user: AccountUser; app?: boolean }) {
  const roles = getUserRoleNames(user);
  const initials = userInitials(user.name);
  const isVerified = Boolean(user.email_verified_at);
  const avatarUrl = resolveUserAvatarUrl(user);

  return (
    <section className={cn('overflow-hidden rounded-2xl border bg-card shadow-sm', app && 'rounded-2xl')}>
      <div className={cn('bg-gradient-to-r from-indigo-500/10 via-background to-background', app ? 'px-5 py-6' : 'px-6 py-8')}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 rounded-2xl border-4 border-background shadow-md">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback className="rounded-2xl text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className={cn('truncate font-semibold tracking-tight', app ? 'text-xl' : 'text-2xl')}>
                {user.name}
              </h2>
              <p className={cn('mt-1 truncate text-muted-foreground', app ? 'text-base' : 'text-sm')}>
                {user.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <RoleBadges roles={roles} />
              <Badge
                variant="outline"
                className={cn(
                  'gap-1 font-medium',
                  isVerified
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
                )}
              >
                {isVerified ? (
                  <MailCheck className="size-3.5" />
                ) : (
                  <Mail className="size-3.5" />
                )}
                {isVerified ? 'Email verified' : 'Email not verified'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t px-6 py-5 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Mail className="size-4 text-muted-foreground" />
          </div>
          <DetailField label="Email" value={user.email} app={app} />
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Phone className="size-4 text-muted-foreground" />
          </div>
          <DetailField label="Phone" value={user.phone ?? '—'} app={app} />
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
          <DetailField label="Member since" value={formatDate(user.created_at)} app={app} />
        </div>
      </div>
    </section>
  );
}

function PasswordSettingsForm({ app = false }: { app?: boolean }) {
  const Section = app ? OwnerFormSection : FormSection;
  const [processing, setProcessing] = React.useState(false);

  const form = useForm<UpdateAccountPasswordFormValues>({
    resolver: zodResolver(updateAccountPasswordFormSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setProcessing(true);
    router.put('/user/account/password', values, {
      preserveScroll: true,
      onSuccess: () => {
        showMutationSuccess('Password updated');
        form.reset();
      },
      onError: () => showMutationError(null, 'Failed to update password'),
      onFinish: () => setProcessing(false),
    });
  });

  return (
    <Section
      title="Password & security"
      description="Choose a strong password that you do not use on other sites."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    disabled={processing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      disabled={processing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      disabled={processing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={cn('pt-2', app ? '' : 'flex justify-end')}>
            <Button type="submit" disabled={processing} className={cn(app && 'w-full')}>
              {processing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 size-4" />
              )}
              Update password
            </Button>
          </div>
        </form>
      </Form>
    </Section>
  );
}

function EmailVerificationNotice({ user, app = false }: { user: AccountUser; app?: boolean }) {
  const Section = app ? OwnerFormSection : FormSection;
  const [isSending, setIsSending] = React.useState(false);

  if (user.email_verified_at) {
    return null;
  }

  const handleResend = () => {
    setIsSending(true);
    router.post(
      '/email/verification-notification',
      {},
      {
        preserveScroll: true,
        onSuccess: () => showMutationSuccess('Verification email sent'),
        onError: () => showMutationError(null, 'Unable to send verification email'),
        onFinish: () => setIsSending(false),
      },
    );
  };

  return (
    <Section
      title="Email verification"
      description="Verify your email to unlock card activation and public profile publishing."
    >
      <div className="flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Your email is not verified yet
            </p>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/80">
              We sent a link to <span className="font-medium">{user.email}</span>.
              Check your inbox or request a new link.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 border-amber-300 bg-background"
          disabled={isSending}
          onClick={handleResend}
        >
          {isSending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Mail className="mr-2 size-4" />
          )}
          Resend email
        </Button>
      </div>
    </Section>
  );
}

export function AccountPage({ user }: AccountPageProps) {
  const isOwnerApp = useOwnerAppShell();

  if (isOwnerApp) {
    return <AccountAppPage user={user} />;
  }

  return <AccountPageContent user={user} variant="dashboard" />;
}

export function AccountPageContent({
  user,
  variant,
}: {
  user: AccountUser;
  variant: AccountPageVariant;
}) {
  const isOwnerApp = variant === 'owner-app';
  const Section = isOwnerApp ? OwnerFormSection : FormSection;

  if (isOwnerApp) {
    return (
      <div className="flex flex-col">
        <div className="border-b px-4 py-4">
          <OwnerAppPageHeader
            title="My account"
            description="Manage your profile, security, and account details."
            icon={BadgeCheck}
          />
        </div>
        <div className="space-y-5 px-4 py-4">
          <ProfileSummaryCard user={user} app />
          <AccountCardLinkSection cardCode={resolveUserCardCode(user)} />
          <PasswordSettingsForm app />
          <EmailVerificationNotice user={user} app />
          <Section
            title="Account overview"
            description="Read-only details about your signed-in account."
          >
            <dl className="grid gap-4">
              <DetailField label="Account ID" value={`#${user.id}`} app />
              <DetailField
                label="Role"
                value={<RoleBadges roles={getUserRoleNames(user)} />}
                app
              />
              <DetailField
                label="Email status"
                value={user.email_verified_at ? 'Verified' : 'Pending verification'}
                app
              />
              <DetailField label="Last updated" value={formatDate(user.updated_at)} app />
            </dl>
          </Section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <PageTitle
        title="My Account"
        description="View and manage your personal profile, security, and account details."
        icon={BadgeCheck}
        color="indigo"
      />

      <ProfileSummaryCard user={user} />

      <AccountCardLinkSection cardCode={resolveUserCardCode(user)} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <PasswordSettingsForm />
        </div>

        <div className="space-y-6">
          <EmailVerificationNotice user={user} />

          <Section
            title="Account overview"
            description="Read-only details about your signed-in account."
          >
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Account ID" value={`#${user.id}`} />
              <DetailField
                label="Role"
                value={<RoleBadges roles={getUserRoleNames(user)} />}
              />
              <DetailField
                label="Email status"
                value={user.email_verified_at ? 'Verified' : 'Pending verification'}
              />
              <DetailField
                label="Last updated"
                value={formatDate(user.updated_at)}
              />
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}
