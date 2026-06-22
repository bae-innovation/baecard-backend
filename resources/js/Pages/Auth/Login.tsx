import { Link, useForm } from '@inertiajs/react';
import { KeyRound, Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/Layouts/AuthLayout';

type LoginPageProps = {
  redirect?: string;
};

export default function Login({ redirect }: LoginPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    redirect: redirect ?? '',
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    post('/login', {
      onSuccess: () => toast.success('Welcome back!'),
      onError: () => toast.error('Invalid email or password.'),
    });
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Enter your credentials to access the admin console."
      icon={KeyRound}
      footer={
        <p>
          {redirect ? (
            <>
              Need an account?{' '}
              <Link
                href={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Register here
              </Link>
              {' · '}
            </>
          ) : null}
          Forgot your password?{' '}
          <Link
            href="/forgot-password"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Reset it here
          </Link>
        </p>
      }
    >
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={processing}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
