<?php

namespace App\Http\Requests\Auth;

use App\Support\CardCodePath;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isCardClaim = $this->isCardClaimRegistration();

        return [
            'name' => [$isCardClaim ? 'nullable' : 'required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => $isCardClaim
                ? ['required', 'string', 'min:8']
                : ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'redirect' => ['nullable', 'string'],
        ];
    }

    private function isCardClaimRegistration(): bool
    {
        $redirect = $this->input('redirect') ?? $this->query('redirect');

        return CardCodePath::isCardCodePath(is_string($redirect) ? $redirect : null);
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'The password field is required.',
            'password.min' => 'The password must be at least 8 characters.',
        ];
    }
}