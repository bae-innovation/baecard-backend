import { Link, router, useForm } from '@inertiajs/react';
import { Loader2, LockKeyhole } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/Layouts/AuthLayout';

type ResetPasswordProps = {
  token?: string;
  email?: string;
  isInvite?: boolean;
};

export default function ResetPassword({ token, email, isInvite = false }: ResetPasswordProps) {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: email ?? '',
    token: token ?? '',
    password: '',
    password_confirmation: '',
  });

  React.useEffect(() => {
    if (email) setData('email', email);
    if (token) setData('token', token);
  }, [email, token, setData]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    post('/reset-password', {
      onSuccess: () => {
        if (!isInvite) {
          setIsSuccess(true);
        }
        toast.success(
          isInvite
            ? 'Password set successfully. Sign in with your new password.'
            : 'Password reset successfully. You can sign in now.',
        );
      },
      onError: () =>
        toast.error(
          isInvite
            ? 'Unable to set your password. The link may have expired.'
            : 'Unable to reset password. The link may have expired.',
        ),
    });
  }

  return (
    <AuthLayout
      title={isInvite ? 'Set your password' : 'Reset password'}
      description={
        isInvite
          ? 'Choose a password for your account to complete setup.'
          : 'Choose a new password for your account.'
      }
      icon={LockKeyhole}
      footer={
        isInvite ? undefined : (
          <p>
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        )
      }
    >
      {isSuccess ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <LockKeyhole className="size-6" aria-hidden />
          </div>
          <div className="space-y-2">
            <p className="font-medium">Password updated</p>
            <p className="text-sm text-muted-foreground">
              Your password has been reset. Sign in with your new credentials.
            </p>
          </div>
          <Button className="w-full" onClick={() => router.visit('/login')}>
            Continue to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              readOnly={Boolean(isInvite && email)}
              disabled={processing || Boolean(isInvite && email)}
              className={isInvite && email ? 'cursor-not-allowed bg-muted/50' : undefined}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email}</p>
            ) : null}
          </div>

          {!isInvite ? (
            <div className="space-y-2">
              <Label htmlFor="token">Reset token</Label>
              <Input
                id="token"
                value={data.token}
                onChange={(e) => setData('token', e.target.value)}
                disabled={processing || !!token}
              />
              {errors.token ? (
                <p className="text-sm text-destructive">{errors.token}</p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="password">{isInvite ? 'Password' : 'New password'}</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              autoComplete="new-password"
              disabled={processing}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              autoComplete="new-password"
              disabled={processing}
            />
            {errors.password_confirmation ? (
              <p className="text-sm text-destructive">{errors.password_confirmation}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {isInvite ? 'Saving password...' : 'Resetting password...'}
              </>
            ) : isInvite ? (
              'Set password'
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
