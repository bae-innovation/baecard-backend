export function objectToFormData(
  values: Record<string, unknown>,
  files?: Record<string, File | null | undefined>,
  method?: 'PUT' | 'PATCH' | 'DELETE',
): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    if (typeof value === 'number' && Number.isNaN(value)) return;
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }
    formData.append(key, String(value));
  });

  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
  }

  if (method) {
    formData.append('_method', method);
  }

  return formData;
}
