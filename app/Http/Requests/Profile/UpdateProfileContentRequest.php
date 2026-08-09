<?php

namespace App\Http\Requests\Profile;

use App\Support\ProfileSocialPlatform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $socialLinks = $this->input('social_links');

        if (is_string($socialLinks)) {
            $decoded = json_decode($socialLinks, true);

            $this->merge([
                'social_links' => is_array($decoded) ? $decoded : [],
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'personal_email' => ['nullable', 'email', 'max:255'],
            'personal_phone_code' => ['nullable', 'string', 'max:8'],
            'personal_phone' => ['nullable', 'string', 'max:32'],
            'personal_address' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'work_email' => ['nullable', 'email', 'max:255'],
            'work_phone_code' => ['nullable', 'string', 'max:8'],
            'work_phone' => ['nullable', 'string', 'max:32'],
            'work_address' => ['nullable', 'string', 'max:500'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required_with:social_links', 'string', Rule::in(ProfileSocialPlatform::all())],
            'social_links.*.url' => ['required_with:social_links', 'string', 'max:500'],
            'profile_image' => ['nullable', 'image', 'max:5120'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'remove_profile_image' => ['sometimes', 'boolean'],
            'remove_cover_image' => ['sometimes', 'boolean'],
        ];
    }
}
