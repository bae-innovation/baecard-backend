import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import { configureAppCurrency } from '@/utils/number-formatter';
import type { AppSettings } from '@/types/app-settings';

export function AppSettingsSync() {
    const { app } = usePage<{ app?: AppSettings }>().props;

    useEffect(() => {
        if (app?.currency) {
            configureAppCurrency(app.currency);
        }
    }, [app?.currency]);

    return null;
}
