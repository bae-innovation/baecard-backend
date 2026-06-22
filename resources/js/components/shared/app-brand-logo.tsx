import { useTheme } from 'next-themes';

import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

type AppBrandLogoProps = {
    variant?: 'sidebar' | 'auth' | 'admin';
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
};

export function AppBrandLogo({
    variant = 'sidebar',
    className,
    imageClassName,
    fallbackClassName,
}: AppBrandLogoProps) {
    const app = useAppSettings();
    const { resolvedTheme } = useTheme();

    const logoUrl = (() => {
        if (variant === 'auth') {
            return app.logo_white_url ?? app.admin_logo_url;
        }

        if (variant === 'admin') {
            return app.admin_logo_url ?? app.logo_black_url ?? app.logo_white_url;
        }

        const isDark = resolvedTheme === 'dark';

        return isDark
            ? (app.logo_white_url ?? app.admin_logo_url)
            : (app.logo_black_url ?? app.admin_logo_url);
    })();

    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={app.name}
                className={cn('object-contain', imageClassName)}
            />
        );
    }

    return (
        <span
            className={cn(
                'flex items-center justify-center font-bold',
                fallbackClassName,
            )}
            aria-hidden
        >
            {app.name.charAt(0).toUpperCase()}
        </span>
    );
}
