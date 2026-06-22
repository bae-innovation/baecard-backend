<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Services\SettingService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected SettingService $settingService,
    ) {}

    public function show(Request $request, string $group)
    {
        if ($group === 'appearance') {
            if (InertiaData::prefersJson($request)) {
                abort(404);
            }

            return Inertia::render('Settings/Index', [
                'group' => 'appearance',
            ]);
        }

        if (InertiaData::prefersJson($request)) {
            if (! SettingService::isValidGroup($group)) {
                abort(404);
            }

            return $this->settingService->findGroup($group);
        }

        if (! SettingService::isPageGroup($group)) {
            return redirect()->route('settings.show', ['group' => 'general']);
        }

        return Inertia::render('Settings/Index', [
            'group' => $group,
            'data' => $this->settingService->getGroup($group),
        ]);
    }

    public function update(UpdateSettingsRequest $request, string $group)
    {
        if ($group === 'appearance' || ! SettingService::isUpdatableGroup($group)) {
            abort(404);
        }

        $data = collect($request->validated())->except([
            'logo_white',
            'logo_black',
            'admin_logo',
        ])->toArray();
        $response = $this->settingService->updateGroup($group, $data, $request);

        if (InertiaData::prefersJson($request)) {
            return $response;
        }

        if ($response->getStatusCode() >= 400) {
            $payload = json_decode($response->getContent(), true);
            $message = $payload['message'] ?? 'An error occurred.';

            return back()->withErrors([
                'branding' => $message,
            ]);
        }

        $redirectGroup = SettingService::redirectGroup($group);
        $url = route('settings.show', ['group' => $redirectGroup]);
        $tab = SettingService::tabForGroup($group);

        if ($tab) {
            $url .= '?tab='.$tab;
        }

        return redirect($url)->with('success', 'Settings saved.');
    }
}
