export type NavSourceItem = {
  readonly title: string;
  readonly url: string;
  readonly management?: string;
  readonly list?: string;
  readonly items?: readonly NavSourceItem[];
};

/** Template nav: no permission filtering. Returns all items unchanged. */
export function filterNavByPermissions<T extends NavSourceItem>(
  _permissions: readonly string[],
  items: readonly T[],
): T[] {
  return [...items];
}
