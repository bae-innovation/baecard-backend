import * as React from 'react';

/**
 * Builds a preview URL for a local file. Uses data URLs so previews work under
 * CSP `img-src` policies that allow `data:` but not `blob:` (e.g. Vercel staging).
 */
export function useFilePreviewUrl(file: File | null): string | null {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    let cancelled = false;
    const reader = new FileReader();

    reader.onload = () => {
      if (!cancelled && typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.onerror = () => {
      if (!cancelled) setPreviewUrl(null);
    };
    reader.readAsDataURL(file);

    return () => {
      cancelled = true;
      reader.abort();
    };
  }, [file]);

  return previewUrl;
}
