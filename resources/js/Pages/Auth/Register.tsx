import { Link, useForm } from '@inertiajs/react';
import { Loader2, UserPlus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/Layouts/AuthLayout';

type RegisterPageProps = {
  redirect?: string;
};

export default function Register({ redirect }: RegisterPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    redirect: redirect ?? '',
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    post('/register', {
      onSuccess: () => toast.success('Account created successfully'),
      onError: () => toast.error('Unable to create account. Please check the form.'),
    });
  }

  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';

  return (
    <AuthLayout
      title="Create account"
      description="Register to claim your BAE Card and publish your profile."
      icon={UserPlus}
      footer={
        <p>
          Already have an account?{' '}
          <Link
            href={loginHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            disabled={processing}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={processing}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => setData('phone', e.target.value)}
            placeholder="+880..."
            autoComplete="tel"
            disabled={processing}
          />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={processing}
          />
          {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm password</Label>
          <Input
            id="password_confirmation"
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={processing}
          />
        </div>

        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
