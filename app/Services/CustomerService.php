<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $customers = Customer::query()
            ->with('roles')
            ->latest()
            ->paginate(10);

        return $this->successResponse($customers, 'Customers retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $customer = Customer::query()->with('roles')->find($id);

        if (! $customer) {
            return $this->notFoundResponse('Customer not found.');
        }

        return $this->successResponse($customer, 'Customer retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $customer = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            UserRole::ensureExists(UserRole::User);
            $customer->assignRole(UserRole::User->value);

            return $this->successResponse(
                $customer->load('roles'),
                'Customer created successfully.',
                201,
            );
        });
    }

    public function update(int $id, array $data): JsonResponse
    {
        return DB::transaction(function () use ($id, $data) {
            $customer = Customer::query()->find($id);

            if (! $customer) {
                return $this->notFoundResponse('Customer not found.');
            }

            $fields = [];

            if (array_key_exists('name', $data)) {
                $fields['name'] = $data['name'];
            }

            if (array_key_exists('email', $data)) {
                $fields['email'] = $data['email'];
            }

            if (array_key_exists('phone', $data)) {
                $fields['phone'] = $data['phone'];
            }

            if ($fields !== []) {
                $customer->update($fields);
            }

            return $this->successResponse(
                $customer->fresh()->load('roles'),
                'Customer updated successfully.',
            );
        });
    }

    public function delete(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $customer = Customer::query()->find($id);

            if (! $customer) {
                return $this->notFoundResponse('Customer not found.');
            }

            if (request()->user() && request()->user()->id === $customer->id) {
                return $this->errorResponse('You cannot delete your own account.', null, 400);
            }

            $customer->tokens()->delete();
            $customer->delete();

            return $this->successResponse(null, 'Customer deleted successfully.');
        });
    }
}
