<?php

namespace Tests\Unit;

use App\Services\BrandingLogoService;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class BrandingLogoServiceTest extends TestCase
{
    public function test_replace_overwrites_existing_svg_with_new_svg(): void
    {
        $directory = public_path(BrandingLogoService::DIRECTORY);
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $target = $directory.DIRECTORY_SEPARATOR.'logo-white.svg';
        file_put_contents($target, '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>');

        $upload = UploadedFile::fake()->createWithContent(
            'logo-white.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>',
            'image/svg+xml',
        );

        $service = app(BrandingLogoService::class);
        $path = $service->replace($upload, 'images/logos/logo-white.svg', 'logo_white');

        $this->assertSame('images/logos/logo-white.svg', $path);
        $this->assertStringContainsString('<circle', file_get_contents($target));
    }

    public function test_replace_switches_extension_and_removes_old_file(): void
    {
        $directory = public_path(BrandingLogoService::DIRECTORY);
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $old = $directory.DIRECTORY_SEPARATOR.'admin-logo.svg';
        file_put_contents($old, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');

        $upload = UploadedFile::fake()->image('admin-logo.png', 32, 32);

        $service = app(BrandingLogoService::class);
        $path = $service->replace($upload, 'images/logos/admin-logo.svg', 'admin_logo');

        $this->assertSame('images/logos/admin-logo.png', $path);
        $this->assertFileDoesNotExist($old);
        $this->assertFileExists(public_path($path));
    }
}
