<?php

namespace App\Http\Requests\Settings;

use App\Services\SettingService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $group = $this->route('group');

        return match ($group) {
            'general' => [
                'site_name' => ['required', 'string', 'max:255'],
                'tagline' => ['nullable', 'string', 'max:255'],
                'site_url' => ['required', 'url', 'max:255'],
                'contact_email' => ['required', 'email', 'max:255'],
                'support_phone' => ['nullable', 'string', 'max:50'],
                'street' => ['nullable', 'string', 'max:255'],
                'city' => ['nullable', 'string', 'max:100'],
                'state' => ['nullable', 'string', 'max:100'],
                'country' => ['nullable', 'string', 'max:100'],
                'postal_code' => ['nullable', 'string', 'max:20'],
                'privacy_policy_url' => ['nullable', 'url', 'max:255'],
                'terms_url' => ['nullable', 'url', 'max:255'],
                'copyright_text' => ['nullable', 'string', 'max:255'],
            ],
            'branding' => [
                'primary_color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
                'logo_white' => $this->brandingImageRules(['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'], 5120),
                'logo_black' => $this->brandingImageRules(['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'], 5120),
                'admin_logo' => $this->brandingImageRules(['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'], 5120),
            ],
            'business' => [
                'currency' => ['required', 'string', 'max:10'],
                'currency_symbol' => ['required', 'string', 'max:10'],
                'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
                'order_prefix' => ['required', 'string', 'max:20'],
            ],
            'social' => [
                'whatsapp' => ['nullable', 'string', 'max:255'],
                'facebook' => ['nullable', 'url', 'max:255'],
                'instagram' => ['nullable', 'url', 'max:255'],
                'twitter' => ['nullable', 'url', 'max:255'],
                'linkedin' => ['nullable', 'url', 'max:255'],
                'youtube' => ['nullable', 'url', 'max:255'],
                'tiktok' => ['nullable', 'url', 'max:255'],
            ],
            'email' => [
                'from_name' => ['required', 'string', 'max:255'],
                'from_email' => ['required', 'email', 'max:255'],
                'support_email' => ['required', 'email', 'max:255'],
            ],
            default => SettingService::isUpdatableGroup((string) $group)
                ? []
                : ['group' => ['prohibited']],
        };
    }

    /**
     * @param  list<string>  $extensions
     * @return list<mixed>
     */
    protected function brandingImageRules(array $extensions, int $maxKilobytes): array
    {
        return [
            'nullable',
            'file',
            'max:'.$maxKilobytes,
            function (string $attribute, mixed $value, \Closure $fail) use ($extensions): void {
                if (! $value instanceof UploadedFile) {
                    return;
                }

                $extension = strtolower($value->getClientOriginalExtension() ?: '');

                if (! in_array($extension, $extensions, true)) {
                    $fail('The '.$attribute.' field must be a file of type: '.implode(', ', $extensions).'.');
                }
            },
        ];
    }
}
