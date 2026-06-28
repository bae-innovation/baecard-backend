/**
 * Deep-merge CMS overrides onto static marketing defaults.
 */
export function deepMergeMarketingContent<T extends Record<string, unknown>>(
  base: T,
  overrides: Partial<T> | null | undefined,
): T {
  if (!overrides) return base;

  const result = { ...base } as T;

  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const overrideVal = overrides[key];
    const baseVal = base[key];

    if (Array.isArray(overrideVal)) {
      result[key] = overrideVal as T[keyof T];
    } else if (
      overrideVal &&
      typeof overrideVal === 'object' &&
      baseVal &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMergeMarketingContent(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      ) as T[keyof T];
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal as T[keyof T];
    }
  }

  return result;
}
