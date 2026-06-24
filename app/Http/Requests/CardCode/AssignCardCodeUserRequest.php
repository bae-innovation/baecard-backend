<?php

namespace App\Http\Requests\CardCode;

use App\Rules\AssignableCardCustomer;
use Illuminate\Foundation\Http\FormRequest;

class AssignCardCodeUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id', new AssignableCardCustomer],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Select a user to assign.',
            'user_id.exists' => 'The selected user does not exist.',
        ];
    }
}
