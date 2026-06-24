import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import type { SharedPageProps } from '@/types/inertia';

type FlashToasterPageProps = SharedPageProps & {
    errors?: Record<string, string | string[]>;
};

export function FlashToaster() {
    const { flash, errors } = usePage<FlashToasterPageProps>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.error]);

    useEffect(() => {
        const formError = errors?.form;

        if (!formError) {
            return;
        }

        toast.error(Array.isArray(formError) ? formError[0] : formError);
    }, [errors?.form]);

    return null;
}
