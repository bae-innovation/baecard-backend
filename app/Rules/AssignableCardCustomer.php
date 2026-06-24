<?php

namespace App\Rules;

use App\Enums\UserRole;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AssignableCardCustomer implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::query()->find($value);

        if (! $user) {
            $fail('The selected user does not exist.');

            return;
        }

        if (! $user->hasRole(UserRole::User->value)) {
            $fail(
                'Only customer accounts can be assigned to a card code. '
                .'Staff accounts must be created under Access Control; customers under Customer Management.',
            );
        }
    }
}
