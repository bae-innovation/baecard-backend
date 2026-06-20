<?php

namespace App\Services;

use App\Models\CustomerSocial;
use App\Support\RoleAbility;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class CustomerSocialService
{
    use ApiResponseTrait;

    public function list(int $customerId): JsonResponse
    {
        $user = request()->user();

        if (! $this->canAccessCustomer($user, $customerId)) {
            return $this->forbiddenResponse('You are not allowed to view these social links.');
        }

        $socials = CustomerSocial::where('customer_id', $customerId)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($socials, 'Customer social links retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $user = request()->user();

        if (! $this->canAccessCustomer($user, (int) $data['customer_id'])) {
            return $this->forbiddenResponse('You are not allowed to create social links for this customer.');
        }

        $social = CustomerSocial::create($data);

        return $this->successResponse($social, 'Customer social link created successfully.', 201);
    }

    public function update(int $id, array $data): JsonResponse
    {
        $social = CustomerSocial::find($id);

        if (! $social) {
            return $this->notFoundResponse('Customer social link not found.');
        }

        $user = request()->user();

        if (! $this->canAccessCustomer($user, $social->customer_id)) {
            return $this->forbiddenResponse('You are not allowed to update this social link.');
        }

        $social->update($data);

        return $this->successResponse($social->fresh(), 'Customer social link updated successfully.');
    }

    public function delete(int $id): JsonResponse
    {
        $social = CustomerSocial::find($id);

        if (! $social) {
            return $this->notFoundResponse('Customer social link not found.');
        }

        $user = request()->user();

        if (! $this->canAccessCustomer($user, $social->customer_id)) {
            return $this->forbiddenResponse('You are not allowed to delete this social link.');
        }

        $social->delete();

        return $this->successResponse(null, 'Customer social link deleted successfully.');
    }

    private function canAccessCustomer($user, int $customerId): bool
    {
        if (! $user) {
            return false;
        }

        if ($user->id === $customerId) {
            return true;
        }

        return RoleAbility::allows($user, 'users.view');
    }
}
