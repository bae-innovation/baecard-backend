<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Builder;

class Customer extends User
{
    protected $table = 'users';

    protected static function booted(): void
    {
        static::addGlobalScope('customer', function (Builder $query): void {
            $query->role(UserRole::User->value);
        });
    }

    public function getMorphClass(): string
    {
        return User::class;
    }

    public function isCustomer(): bool
    {
        return true;
    }
}
