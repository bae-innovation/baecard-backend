import { toast } from 'sonner';

import { extractMsgFromError } from '@/lib/parse-api-error';

export async function showMutationError(
  error: unknown,
  fallback: string,
): Promise<void> {
  const message = await extractMsgFromError(error, fallback);
  toast.error(message);
}

export function showMutationSuccess(message: string): void {
  toast.success(message);
}
