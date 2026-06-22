import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from 'next-themes';
import { createRoot } from 'react-dom/client';
import { Toaster as SonnerToaster } from 'sonner';

import { EnvironmentBanner } from '@/components/shared/environment-banner';
import { OfflineIndicator } from '@/components/shared/offline-indicator';
import { AccentPaletteProvider } from '@/components/providers/accent-palette-provider';
import { Toaster } from '@/components/ui/toaster';
import { ApiErrorModalProvider } from '@/lib/api-error-modal';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AccentPaletteProvider>
                    <ApiErrorModalProvider>
                        <App {...props} />
                        <Toaster />
                        <OfflineIndicator />
                        <SonnerToaster position="bottom-right" />
                        <EnvironmentBanner style="ribbon" position="corner-right" />
                    </ApiErrorModalProvider>
                </AccentPaletteProvider>
            </ThemeProvider>,
        );
    },
});
