<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use InvalidArgumentException;
use RuntimeException;

class BrandingLogoService
{
    public const DIRECTORY = 'images/logos';

    public const FIELD_BASENAMES = [
        'logo_white' => 'logo-white',
        'logo_black' => 'logo-black',
        'admin_logo' => 'admin-logo',
    ];

    public function replace(?UploadedFile $file, ?string $existingPath, string $field): ?string
    {
        if (! $file) {
            return $existingPath;
        }

        $basename = $this->basenameForField($field);
        $newPath = $this->store($file, $basename);

        $this->deleteOtherExtensions($basename, basename($newPath));

        return $newPath;
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        $fullPath = public_path($path);

        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }

    protected function basenameForField(string $field): string
    {
        if (! isset(self::FIELD_BASENAMES[$field])) {
            throw new InvalidArgumentException("Invalid branding logo field [{$field}].");
        }

        return self::FIELD_BASENAMES[$field];
    }

    protected function deleteOtherExtensions(string $basename, string $keepFilename): void
    {
        $directory = public_path(self::DIRECTORY);

        if (! is_dir($directory)) {
            return;
        }

        $pattern = $directory.DIRECTORY_SEPARATOR.$basename.'.*';

        foreach (glob($pattern) ?: [] as $file) {
            if (is_file($file) && basename($file) !== $keepFilename) {
                unlink($file);
            }
        }
    }

    protected function store(UploadedFile $file, string $basename): string
    {
        $directory = public_path(self::DIRECTORY);

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'png');
        $extension = match ($extension) {
            'jpeg' => 'jpg',
            default => $extension,
        };

        $filename = "{$basename}.{$extension}";
        $fullPath = $directory.DIRECTORY_SEPARATOR.$filename;

        if ($this->shouldStripMetadata($extension)) {
            $this->saveWithoutMetadata($file, $fullPath, $extension);
        } else {
            $this->storeBinaryFile($file, $directory, $filename, $fullPath);
        }

        return self::DIRECTORY.'/'.$filename;
    }

    protected function storeBinaryFile(
        UploadedFile $file,
        string $directory,
        string $filename,
        string $destination,
    ): void {
        $tempFilename = $filename.'.tmp-'.bin2hex(random_bytes(4));
        $file->move($directory, $tempFilename);

        $tempPath = $directory.DIRECTORY_SEPARATOR.$tempFilename;

        if (is_file($destination)) {
            unlink($destination);
        }

        if (! rename($tempPath, $destination)) {
            if (is_file($tempPath)) {
                unlink($tempPath);
            }

            throw new RuntimeException('Unable to save uploaded file.');
        }
    }

    protected function shouldStripMetadata(string $extension): bool
    {
        return in_array($extension, ['jpg', 'png', 'gif', 'webp'], true);
    }

    protected function saveWithoutMetadata(UploadedFile $file, string $destination, string $extension): void
    {
        $sourcePath = $file->getRealPath();

        if (! $sourcePath) {
            throw new RuntimeException('Unable to read uploaded file.');
        }

        $image = match ($extension) {
            'jpg' => @imagecreatefromjpeg($sourcePath),
            'png' => @imagecreatefrompng($sourcePath),
            'gif' => @imagecreatefromgif($sourcePath),
            'webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($sourcePath) : false,
            default => false,
        };

        if ($image === false) {
            throw new RuntimeException('Unable to process image. Upload a valid image file.');
        }

        if ($extension === 'png' || $extension === 'gif' || $extension === 'webp') {
            imagealphablending($image, false);
            imagesavealpha($image, true);
        }

        $saved = match ($extension) {
            'jpg' => imagejpeg($image, $destination, 90),
            'png' => imagepng($image, $destination, 6),
            'gif' => imagegif($image, $destination),
            'webp' => imagewebp($image, $destination, 90),
            default => false,
        };

        imagedestroy($image);

        if (! $saved) {
            throw new RuntimeException('Unable to save processed image.');
        }
    }
}
