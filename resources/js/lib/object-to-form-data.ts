export function objectToFormData(
  values: Record<string, unknown>,
  files?: Record<string, File | File[] | null | undefined>,
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
    if (typeof File !== 'undefined' && value instanceof File) {
      formData.append(key, value);
      return;
    }
    if (typeof Blob !== 'undefined' && value instanceof Blob) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });

  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      if (!file) return;
      if (Array.isArray(file)) {
        file.forEach((entry) => {
          if (entry) formData.append(`${key}[]`, entry);
        });
        return;
      }
      formData.append(key, file);
    });
  }

  if (method) {
    formData.append('_method', method);
  }

  return formData;
}
