export const UPLOAD_CONVERTIBLE_IMAGE_ACCEPT =
  'image/png,image/jpeg,image/jpg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif';

export type ConvertImageToWebpOptions = {
  /** WebP quality from 0 to 1. Default 0.85 */
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

const WEBP_MIME = 'image/webp';

function buildWebpFileName(originalName: string): string {
  const trimmed = originalName.trim();
  const dotIndex = trimmed.lastIndexOf('.');

  if (dotIndex <= 0) {
    return `${trimmed || 'image'}.webp`;
  }

  return `${trimmed.slice(0, dotIndex)}.webp`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read the selected image.'));
    };

    image.src = url;
  });
}

function scaleDimensions(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) {
    return { width, height };
  }

  const widthScale = maxWidth ? maxWidth / width : 1;
  const heightScale = maxHeight ? maxHeight / height : 1;
  const scale = Math.min(widthScale, heightScale, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Converts a browser image File to WebP before upload.
 * Returns the original file unchanged when it is already WebP.
 */
export async function convertImageToWebp(
  file: File,
  options: ConvertImageToWebpOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be converted to WebP.');
  }

  if (file.type === WEBP_MIME) {
    return file;
  }

  const { quality = 0.85, maxWidth, maxHeight } = options;
  const image = await loadImageElement(file);
  const { width, height } = scaleDimensions(image.naturalWidth, image.naturalHeight, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to process the selected image.');
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('WebP conversion is not supported in this browser.'));
          return;
        }

        resolve(result);
      },
      WEBP_MIME,
      quality,
    );
  });

  return new File([blob], buildWebpFileName(file.name), {
    type: WEBP_MIME,
    lastModified: Date.now(),
  });
}

/**
 * Convenience alias for upload flows: pick a file, convert to WebP, return upload-ready File.
 */
export async function prepareImageUploadAsWebp(
  file: File,
  options?: ConvertImageToWebpOptions,
): Promise<File> {
  return convertImageToWebp(file, options);
}
