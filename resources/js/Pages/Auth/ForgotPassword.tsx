import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2, Mail } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/Layouts/AuthLayout';
import type { SharedPageProps } from '@/types/inertia';

type ForgotPasswordPageProps = SharedPageProps & {
  mail?: {
    driver?: string;
    usesLogDriver?: boolean;
    exposeDevLinks?: boolean;
  };
};

export default function ForgotPassword() {
  const { flash, mail } = usePage<ForgotPasswordPageProps>().props;
  const [emailSent, setEmailSent] = React.useState(false);
  const [devResetUrl, setDevResetUrl] = React.useState<string | null>(null);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    post('/forgot-password', {
      onSuccess: ({ props }) => {
        setEmailSent(true);
        const pageProps = props as ForgotPasswordPageProps;
        setDevResetUrl(pageProps.flash?.devResetUrl ?? null);
        toast.success(
          pageProps.mail?.usesLogDriver
            ? 'Reset link generated. Use the link below or check storage/logs/laravel.log.'
            : 'If that email exists, a reset link has been sent.',
        );
      },
      onError: (formErrors) => {
        const message =
          typeof formErrors.email === 'string'
            ? formErrors.email
            : 'Unable to send reset link. Please try again.';
        toast.error(message);
      },
    });
  }

  const resetUrl = devResetUrl ?? flash.devResetUrl ?? null;

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email and we'll send you a link to reset your password."
      icon={Mail}
      footer={
        <p>
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {emailSent ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Mail className="size-6" aria-hidden />
          </div>
          <div className="space-y-2">
            <p className="font-medium">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              If an account exists for{' '}
              <span className="font-medium text-foreground">{data.email}</span>, you
              will receive a password reset link shortly.
            </p>
          </div>

          {resetUrl ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm text-blue-950">
              <p className="font-medium">Mail driver: {mail?.driver ?? 'log'}</p>
              <p className="mt-1 text-blue-900">
                Email is not sent to a real inbox in this mode. Use this link to reset
                your password now:
              </p>
              <a
                href={resetUrl}
                className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
              >
                Open reset password link
              </a>
            </div>
          ) : null}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Return to sign in</Link>
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
              placeholder="you@company.com"
              autoComplete="email"
              disabled={processing}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
