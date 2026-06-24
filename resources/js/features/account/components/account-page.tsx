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
import { ProfileAvatarField } from '@/features/account/components/profile-avatar-field';
import { resolveUserAvatarUrl } from '@/features/account/lib/user-avatar';
import { resolveUserCardCode } from '@/features/account/lib/user-card-code';
import {
  type AccountUser,
  type UpdateAccountFormValues,
  type UpdateAccountPasswordFormValues,
  updateAccountFormSchema,
  updateAccountPasswordFormSchema,
} from '@/features/account/schemas/account.schema';
import { getUserRoleNames } from '@/features/users/schemas/user.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';

type AccountPageProps = {
  user: AccountUser;
};

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
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  const empty = value == null || value === '' || value === '—';

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          'text-sm leading-relaxed',
          empty && 'text-muted-foreground',
        )}
      >
        {empty ? '—' : value}
      </dd>
    </div>
  );
}

function ProfileSummaryCard({ user }: { user: AccountUser }) {
  const roles = getUserRoleNames(user);
  const initials = userInitials(user.name);
  const isVerified = Boolean(user.email_verified_at);
  const avatarUrl = resolveUserAvatarUrl(user);

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="bg-gradient-to-r from-indigo-500/10 via-background to-background px-6 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 rounded-2xl border-4 border-background shadow-md">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback className="rounded-2xl text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="truncate text-2xl font-semibold tracking-tight">
                {user.name}
              </h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">
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
          <DetailField label="Email" value={user.email} />
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Phone className="size-4 text-muted-foreground" />
          </div>
          <DetailField label="Phone" value={user.phone ?? '—'} />
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
          <DetailField label="Member since" value={formatDate(user.created_at)} />
        </div>
      </div>
    </section>
  );
}

function ProfileSettingsForm({ user }: { user: AccountUser }) {
  const [processing, setProcessing] = React.useState(false);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = React.useState(false);

  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountFormSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? '',
    },
  });

  React.useEffect(() => {
    form.reset({
      name: user.name,
      phone: user.phone ?? '',
    });
    setAvatarFile(null);
    setRemoveAvatar(false);
  }, [user, form]);

  const onSubmit = form.handleSubmit((values) => {
    setProcessing(true);
    router.post(
      '/user/account',
      objectToFormData(
        {
          ...values,
          ...(removeAvatar ? { remove_avatar: '1' } : {}),
        },
        { avatar: avatarFile },
        'PUT',
      ),
      {
        preserveScroll: true,
        forceFormData: true,
        only: ['user', 'auth'],
        onSuccess: () => showMutationSuccess('Profile updated'),
        onError: () => showMutationError(null, 'Failed to update profile'),
        onFinish: () => setProcessing(false),
      },
    );
  });

  return (
    <FormSection
      title="Profile information"
      description="Update your photo, name, and contact details."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <ProfileAvatarField
            user={user}
            avatarFile={avatarFile}
            removeAvatar={removeAvatar}
            onAvatarFileChange={setAvatarFile}
            onRemoveAvatarChange={setRemoveAvatar}
            disabled={processing}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    disabled={processing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                value={user.email}
                type="email"
                readOnly
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed from this page.
              </p>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+1 555 000 0000"
                      autoComplete="tel"
                      disabled={processing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={processing}>
              {processing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Save profile
            </Button>
          </div>
        </form>
      </Form>
    </FormSection>
  );
}

function PasswordSettingsForm() {
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
    <FormSection
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

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={processing}>
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
    </FormSection>
  );
}

function EmailVerificationNotice({ user }: { user: AccountUser }) {
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
    <FormSection
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
    </FormSection>
  );
}

export function AccountPage({ user }: AccountPageProps) {
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
          <ProfileSettingsForm user={user} />
          <PasswordSettingsForm />
        </div>

        <div className="space-y-6">
          <EmailVerificationNotice user={user} />

          <FormSection
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
          </FormSection>
        </div>
      </div>
    </div>
  );
}
