<?php

namespace App\Http\Requests\Role;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
        $roleId = $this->resolveRoleId();

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->where('guard_name', 'sanctum')
                    ->ignore($roleId, 'id'),
            ],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The role name field is required.',
            'name.unique' => 'This role name already exists.',
            'permissions.present' => 'Permissions must be provided.',
            'permissions.array' => 'Permissions must be a valid list.',
        ];
    }

    private function resolveRoleId(): int
    {
        $role = $this->route('role') ?? $this->route('id');

        if ($role instanceof Role) {
            return (int) $role->getKey();
        }

        if ($role !== null && $role !== '') {
            return (int) $role;
        }

        return (int) $this->segment(3);
    }
}
