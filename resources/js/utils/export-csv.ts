function escapeCsvCell(value: string | number | boolean | null | undefined) {
  const text = value == null ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Download rows as CSV in the browser. First row is treated as headers. */
export function downloadCsv(
  rows: ReadonlyArray<ReadonlyArray<string | number | boolean | null | undefined>>,
  filename = `export-${new Date().toISOString().slice(0, 10)}.csv`,
) {
  if (rows.length === 0) return;

  const csvContent = rows
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Convert objects with string keys into a CSV download. */
export function downloadObjectsAsCsv<T extends Record<string, unknown>>(
  items: readonly T[],
  columns: ReadonlyArray<{ key: keyof T & string; header: string }>,
  filename?: string,
) {
  if (items.length === 0) return;

  const rows: string[][] = [
    columns.map((column) => column.header),
    ...items.map((item) =>
      columns.map((column) => {
        const value = item[column.key];
        return value == null ? '' : String(value);
      }),
    ),
  ];

  downloadCsv(rows, filename);
}
