<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CustomerResolver
{
    public function findOrCreateForCheckout(string $name, string $phone, string $email): User
    {
        UserRole::ensureExists(UserRole::User);

        $email = strtolower(trim($email));
        $phone = trim($phone);
        $name = trim($name);

        $byPhone = $this->findCustomerByPhone($phone);

        if ($byPhone) {
            $this->syncCustomerFields($byPhone, $name, $phone, $email);

            return $byPhone->fresh();
        }

        $byEmail = $this->findCustomerByEmail($email);

        if ($byEmail) {
            if ($byEmail->phone && $byEmail->phone !== $phone) {
                throw ValidationException::withMessages([
                    'email' => ['This email is already registered with a different phone number.'],
                ]);
            }

            $this->syncCustomerFields($byEmail, $name, $phone, $email);

            return $byEmail->fresh();
        }

        if (User::query()->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already in use.'],
            ]);
        }

        $customer = User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => Str::password(32),
        ]);

        $customer->assignRole(UserRole::User->value);
        $customer->ensureProfile();

        return $customer;
    }

    /**
     * @param  array{name: string, email: string, phone?: string|null, password?: string|null}  $data
     */
    public function createFromAdmin(array $data): User
    {
        UserRole::ensureExists(UserRole::User);

        $email = strtolower(trim($data['email']));

        if (User::query()->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already in use.'],
            ]);
        }

        $phone = isset($data['phone']) ? trim((string) $data['phone']) : null;
        $phone = $phone === '' ? null : $phone;

        if ($phone !== null) {
            $existing = $this->findCustomerByPhone($phone);

            if ($existing) {
                throw ValidationException::withMessages([
                    'phone' => ['This phone number is already registered to another customer.'],
                ]);
            }
        }

        $customer = User::create([
            'name' => trim($data['name']),
            'email' => $email,
            'phone' => $phone,
            'password' => $data['password'] ?? Str::password(32),
        ]);

        $customer->assignRole(UserRole::User->value);
        $customer->ensureProfile();

        return $customer;
    }

    public function findByIdForOrder(int $id): User
    {
        $customer = Customer::query()->find($id);

        if (! $customer) {
            throw new HttpException(422, 'The selected customer does not exist.');
        }

        return $customer;
    }

    private function findCustomerByPhone(string $phone): ?User
    {
        return User::role(UserRole::User->value)
            ->where('phone', $phone)
            ->first();
    }

    private function findCustomerByEmail(string $email): ?User
    {
        return User::role(UserRole::User->value)
            ->where('email', $email)
            ->first();
    }

    private function syncCustomerFields(User $customer, string $name, string $phone, string $email): void
    {
        $updates = [];

        if ($customer->name !== $name) {
            $updates['name'] = $name;
        }

        if ($customer->phone !== $phone) {
            $updates['phone'] = $phone;
        }

        if (strtolower((string) $customer->email) !== $email) {
            $emailTaken = User::query()
                ->where('email', $email)
                ->where('id', '!=', $customer->id)
                ->exists();

            if ($emailTaken) {
                throw ValidationException::withMessages([
                    'email' => ['This email is already in use by another account.'],
                ]);
            }

            $updates['email'] = $email;
        }

        if ($updates !== []) {
            $customer->update($updates);
        }
    }
}
