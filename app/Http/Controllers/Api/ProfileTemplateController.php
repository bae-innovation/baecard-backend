<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Support\ProfilePreviewData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileTemplateController extends Controller
{
    use RespondsWithInertia;

    public function index(Request $request)
    {
        $user = $request->user();
        $profile = $user->ensureProfile();
        $preview = ProfilePreviewData::forUser($user);

        return Inertia::render('Profile/Template', [
            'active_template' => $profile->active_template ?? 1,
            ...$preview,
        ]);
    }

    public function activate(Request $request, int $template)
    {
        $request->user()->ensureProfile()->update(['active_template' => $template]);

        return back()->with('success', 'Template activated.');
    }
}
