<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileVisibilityRequest;
use App\Services\ImageUploadService;
use App\Support\ProfilePreviewData;
use App\Support\ProfileSocialPlatform;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileTemplateController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ImageUploadService $imageUploadService,
    ) {}

    public function templatePage(Request $request, int $template)
    {
        $user = $request->user();
        $preview = ProfilePreviewData::forUser($user, $template);

        return Inertia::render('Profile/Template', [
            'template_id' => $template,
            'active_template' => $user->active_template ?? 1,
            'profile_visibility' => array_merge(
                ProfileSocialPlatform::defaultVisibility(),
                $user->profile_visibility ?? [],
            ),
            'template_settings' => $user->template_settings ?? [],
            ...$preview,
        ]);
    }

    public function activate(Request $request, int $template)
    {
        $request->user()->update(['active_template' => $template]);

        return back()->with('success', 'Template activated.');
    }

    public function updateVisibility(UpdateProfileVisibilityRequest $request)
    {
        $user = $request->user();
        $current = array_merge(
            ProfileSocialPlatform::defaultVisibility(),
            $user->profile_visibility ?? [],
        );

        $user->update([
            'profile_visibility' => array_merge($current, $request->validated()),
        ]);

        return back()->with('success', 'Visibility settings saved.');
    }

    public function uploadCover(Request $request, int $template)
    {
        $request->validate([
            'cover_image' => ['required', 'image', 'max:5120'],
        ]);

        $user = $request->user();
        $settings = $user->template_settings ?? [];
        $key = (string) $template;
        $existing = $settings[$key]['cover_image'] ?? null;

        $path = $this->imageUploadService->replace(
            $request->file('cover_image'),
            $existing,
            'profile/covers',
        );

        $settings[$key] = array_merge($settings[$key] ?? [], [
            'cover_image' => $path,
        ]);

        $user->update(['template_settings' => $settings]);

        return back()->with('success', 'Cover image updated.');
    }
}
