import { router, usePage } from '@inertiajs/react';
import { Loader2, MailCheck } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/Layouts/AuthLayout';
import type { SharedPageProps } from '@/types/inertia';

type VerifyEmailPageProps = SharedPageProps & {
  redirect?: string;
  cardCode?: {
    code: string;
    name: string;
  } | null;
  verificationUrl?: string | null;
  mail?: {
    driver?: string;
    usesLogDriver?: boolean;
    exposeDevLinks?: boolean;
  };
};

export default function VerifyEmail({
  redirect,
  cardCode,
  verificationUrl,
  mail,
}: VerifyEmailPageProps) {
  const { auth, flash } = usePage<VerifyEmailPageProps>().props;
  const [isSending, setIsSending] = React.useState(false);

  const verifyUrl = verificationUrl ?? flash.verificationUrl ?? null;

  const handleResend = () => {
    setIsSending(true);
    router.post('/email/verification-notification', {}, {
      preserveScroll: true,
      onFinish: () => setIsSending(false),
    });
  };

  return (
    <AuthLayout
      title="Verify your email"
      description={
        cardCode
          ? `Register complete. Verify your email to activate card ${cardCode.code}.`
          : 'Verify your email address to continue.'
      }
      icon={MailCheck}
      footer={
        <p className="text-sm text-muted-foreground">
          Wrong account?{' '}
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => router.post('/logout')}
          >
            Sign out
          </button>
        </p>
      }
    >
      <div className="space-y-4">
        {cardCode ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">Card waiting to activate</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {cardCode.code}
              </Badge>
              <span className="text-muted-foreground">{cardCode.name}</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              After you verify your email, this link will become your public card profile.
            </p>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          We sent a verification link to{' '}
          <span className="font-medium text-foreground">
            {auth?.user?.email ?? 'your email address'}
          </span>
          . Open the email and click the button to continue
          {redirect ? ' with your card activation' : ''}.
        </p>

        {verifyUrl ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
            <p className="font-medium">
              {mail?.usesLogDriver ? 'Log mail mode' : 'Development link'}
            </p>
            <p className="mt-1 text-blue-900">
              {mail?.usesLogDriver ? (
                <>
                  Mail driver is <code className="rounded bg-blue-100 px-1">{mail.driver}</code>,
                  so nothing is delivered to your inbox. Use this link to verify now:
                </>
              ) : (
                <>You can also verify using this direct link:</>
              )}
            </p>
            <a
              href={verifyUrl}
              className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
            >
              Verify email now
            </a>
          </div>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isSending}
          onClick={handleResend}
        >
          {isSending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend verification email'
          )}
        </Button>
      </div>
    </AuthLayout>
  );
}
