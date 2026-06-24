<?php

namespace App\Services;

use App\Models\CustomerSocial;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ProfileSocialService
{
    use ApiResponseTrait;

    public function listForUser(int $userId)
    {
        return CustomerSocial::where('customer_id', $userId)
            ->orderBy('sort_order')
            ->get();
    }

    public function createForUser(int $userId, array $data): JsonResponse
    {
        $sortOrder = $data['sort_order']
            ?? ((int) CustomerSocial::where('customer_id', $userId)->max('sort_order') + 1);

        $social = CustomerSocial::create([
            'customer_id' => $userId,
            'platform' => $data['platform'],
            'platform_value' => $data['platform_value'],
            'url' => $data['url'] ?? null,
            'label' => $data['label'] ?? null,
            'is_primary' => $data['is_primary'] ?? false,
            'sort_order' => $sortOrder,
        ]);

        return $this->successResponse($social, 'Social link created.', 201);
    }

    public function updateForUser(int $userId, int $id, array $data): JsonResponse
    {
        $social = CustomerSocial::where('customer_id', $userId)->find($id);

        if (! $social) {
            return $this->notFoundResponse('Social link not found.');
        }

        $social->update($data);

        return $this->successResponse($social->fresh(), 'Social link updated.');
    }

    public function deleteForUser(int $userId, int $id): JsonResponse
    {
        $social = CustomerSocial::where('customer_id', $userId)->find($id);

        if (! $social) {
            return $this->notFoundResponse('Social link not found.');
        }

        $social->delete();

        return $this->successResponse(null, 'Social link deleted.');
    }

    public function reorderForUser(int $userId, array $items): JsonResponse
    {
        foreach ($items as $item) {
            CustomerSocial::where('customer_id', $userId)
                ->where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return $this->successResponse(
            $this->listForUser($userId),
            'Social links reordered.',
        );
    }
}
