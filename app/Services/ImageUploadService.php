<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class ImageUploadService
{
    /**
     * Store an uploaded image under public/images/upload/{type}/.
     * Returns the path relative to public/ (e.g. images/upload/product/abc.jpg).
     */
    public function store(UploadedFile $file, string $type): string
    {
        $directory = public_path("images/upload/{$type}");

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = $file->hashName();
        $file->move($directory, $filename);

        return "images/upload/{$type}/{$filename}";
    }

    /**
     * Delete a stored image by its path relative to public/.
     */
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

    /**
     * Replace an existing image with a new upload.
     */
    public function replace(?UploadedFile $file, ?string $existingPath, string $type): ?string
    {
        if (! $file) {
            return $existingPath;
        }

        $this->delete($existingPath);

        return $this->store($file, $type);
    }
}
