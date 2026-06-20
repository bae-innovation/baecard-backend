<?php

namespace App\Services;

use App\Models\Vendor;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class VendorService
{
    use ApiResponseTrait;

    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function list(): JsonResponse
    {
        $vendors = Vendor::latest()->paginate(10);

        return $this->successResponse($vendors, 'Vendors retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $vendor = Vendor::find($id);

        if (! $vendor) {
            return $this->notFoundResponse('Vendor not found.');
        }

        return $this->successResponse($vendor, 'Vendor retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $imagePath = null;

        if (request()->hasFile('image')) {
            $imagePath = $this->imageUploadService->store(request()->file('image'), 'vendor');
        }

        $vendor = Vendor::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'image' => $imagePath,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'website' => $data['website'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $this->successResponse($vendor, 'Vendor created successfully.', 201);
    }

    public function update(int $id, array $data): JsonResponse
    {
        $vendor = Vendor::find($id);

        if (! $vendor) {
            return $this->notFoundResponse('Vendor not found.');
        }

        $fields = collect($data)->except('image')->toArray();

        if (request()->hasFile('image')) {
            $fields['image'] = $this->imageUploadService->replace(
                request()->file('image'),
                $vendor->image,
                'vendor'
            );
        }

        $vendor->update($fields);

        return $this->successResponse($vendor->fresh(), 'Vendor updated successfully.');
    }

    public function delete(int $id): JsonResponse
    {
        $vendor = Vendor::find($id);

        if (! $vendor) {
            return $this->notFoundResponse('Vendor not found.');
        }

        $this->imageUploadService->delete($vendor->image);
        $vendor->delete();

        return $this->successResponse(null, 'Vendor deleted successfully.');
    }
}
