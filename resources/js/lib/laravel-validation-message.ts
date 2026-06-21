function flattenMessageBag(message: unknown): string | null {
  if (!message || typeof message !== 'object') return null;
  const parts: string[] = [];
  for (const value of Object.values(message as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') parts.push(item);
      }
    } else if (typeof value === 'string') {
      parts.push(value);
    }
  }
  return parts.length ? parts.join(' ') : null;
}

/** Extract a user-visible message from typical Laravel JSON error bodies. */
export function messageFromLaravelResponseBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;

  const record = body as Record<string, unknown>;
  const message = record.message;

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  const fromBag = flattenMessageBag(message);
  if (fromBag) return fromBag;

  if (record.errors && typeof record.errors === 'object') {
    return flattenMessageBag(record.errors);
  }

  return null;
}
