import { Head } from '@inertiajs/react';

import { useAppSettings } from '@/hooks/useAppSettings';

type AppHeadProps = {
    title?: string;
};

export function AppHead({ title }: AppHeadProps) {
    const app = useAppSettings();
    const pageTitle = title ? `${title} · ${app.name}` : app.name;

    return (
        <Head title={pageTitle} />
    );
}
