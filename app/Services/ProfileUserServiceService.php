<?php

namespace App\Services;

use App\Models\UserService as UserServiceModel;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileUserServiceService
{
    use ApiResponseTrait;

    public function __construct(
        protected ImageUploadService $imageUploadService,
    ) {}

    public function listForUser(int $userId)
    {
        return UserServiceModel::where('user_id', $userId)
            ->orderBy('sort_order')
            ->get();
    }

    public function createForUser(int $userId, array $data, Request $request): JsonResponse
    {
        $sortOrder = $data['sort_order']
            ?? ((int) UserServiceModel::where('user_id', $userId)->max('sort_order') + 1);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageUploadService->store(
                $request->file('image'),
                'profile/services',
            );
        }

        $service = UserServiceModel::create([
            'user_id' => $userId,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'] ?? null,
            'image' => $imagePath,
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $sortOrder,
        ]);

        return $this->successResponse($service, 'Service created.', 201);
    }

    public function updateForUser(int $userId, int $id, array $data, Request $request): JsonResponse
    {
        $service = UserServiceModel::where('user_id', $userId)->find($id);

        if (! $service) {
            return $this->notFoundResponse('Service not found.');
        }

        $fields = collect($data)->only([
            'name', 'description', 'price', 'is_active', 'sort_order',
        ])->filter(fn ($value) => $value !== null)->all();

        if ($request->hasFile('image')) {
            $fields['image'] = $this->imageUploadService->replace(
                $request->file('image'),
                $service->image,
                'profile/services',
            );
        } elseif ($request->boolean('remove_image')) {
            $this->imageUploadService->delete($service->image);
            $fields['image'] = null;
        }

        $service->update($fields);

        return $this->successResponse($service->fresh(), 'Service updated.');
    }

    public function deleteForUser(int $userId, int $id): JsonResponse
    {
        $service = UserServiceModel::where('user_id', $userId)->find($id);

        if (! $service) {
            return $this->notFoundResponse('Service not found.');
        }

        $this->imageUploadService->delete($service->image);
        $service->delete();

        return $this->successResponse(null, 'Service deleted.');
    }

    public function reorderForUser(int $userId, array $items): JsonResponse
    {
        foreach ($items as $item) {
            UserServiceModel::where('user_id', $userId)
                ->where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return $this->successResponse(
            $this->listForUser($userId),
            'Services reordered.',
        );
    }
}
