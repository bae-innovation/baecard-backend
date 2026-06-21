import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AuthLayoutProps = {
    title: string;
    description: string;
    icon?: LucideIcon;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
};

export function AuthLayout({
    title,
    description,
    icon: Icon,
    children,
    footer,
    className,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col bg-background lg:flex-row">
            <div className="relative hidden flex-1 overflow-hidden lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_45%)]" />
                <div className="relative z-10 flex flex-col justify-between p-10 text-white">
                    <div>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
                            B
                        </div>
                        <h1 className="mt-8 max-w-md text-4xl font-bold tracking-tight">
                            BAE Card Admin
                        </h1>
                        <p className="mt-4 max-w-md text-base text-white/85">
                            Manage users, roles, and business cards from one secure console.
                        </p>
                    </div>
                    <p className="text-sm text-white/70">
                        Secure access for your team. Sign in to continue.
                    </p>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
                <div className={cn('w-full max-w-md space-y-8', className)}>
                    <div className="space-y-2 text-center lg:text-left">
                        {Icon ? (
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 lg:mx-0 dark:bg-indigo-950 dark:text-indigo-300">
                                <Icon className="size-6" aria-hidden />
                            </div>
                        ) : null}
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        {children}
                    </div>

                    {footer ? (
                        <div className="text-center text-sm text-muted-foreground lg:text-left">
                            {footer}
                        </div>
                    ) : null}

                    <p className="text-center text-xs text-muted-foreground lg:hidden">
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            BAE Card Admin
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
