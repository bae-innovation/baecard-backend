import { messageFromLaravelResponseBody } from '@/lib/laravel-validation-message';

async function readJsonBody(response: Response): Promise<unknown | null> {
    try {
        return await response.clone().json();
    } catch {
        try {
            const text = (await response.clone().text()).trim();
            if (!text) return null;
            return JSON.parse(text) as unknown;
        } catch {
            return null;
        }
    }
}

/**
 * Parse HTTP error response body and return a user-visible message.
 */
export async function extractMsgFromError(
    error: unknown,
    fallback: string,
): Promise<string> {
    let response: Response | null = null;

    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response: unknown }).response instanceof Response
    ) {
        response = (error as { response: Response }).response;
    }

    if (!response) {
        return fallback;
    }

    try {
        const raw = await readJsonBody(response);
        if (raw && typeof raw === 'object' && raw !== null) {
            const msg = messageFromLaravelResponseBody(raw);
            if (msg) return msg;
        }
    } catch {
        /* use fallback */
    }

    return fallback;
}
