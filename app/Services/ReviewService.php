<?php

namespace App\Services;

use App\Models\Review;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ReviewService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $reviews = Review::with(['product:id,name', 'user:id,name'])
            ->where('is_visible', true)
            ->latest()
            ->paginate(10);

        return $this->successResponse($reviews, 'Reviews retrieved successfully.');
    }

    public function listAdmin(): JsonResponse
    {
        $reviews = Review::with(['product:id,name', 'user:id,name'])
            ->latest()
            ->paginate(10);

        return $this->successResponse($reviews, 'Reviews retrieved successfully.');
    }

    public function find(int $id, bool $publicOnly = true): JsonResponse
    {
        $query = Review::with(['product:id,name', 'user:id,name']);

        if ($publicOnly) {
            $query->where('is_visible', true);
        }

        $review = $query->find($id);

        if (! $review) {
            return $this->notFoundResponse('Review not found.');
        }

        return $this->successResponse($review, 'Review retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $user = request()->user();

        $review = Review::create([
            'product_id' => $data['product_id'] ?? null,
            'user_id' => $user?->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'body' => $data['body'],
        ]);

        return $this->successResponse(
            $review->load(['product:id,name', 'user:id,name']),
            'Review submitted successfully.',
            201
        );
    }

    public function update(int $id, array $data): JsonResponse
    {
        $review = Review::find($id);

        if (! $review) {
            return $this->notFoundResponse('Review not found.');
        }

        $review->update($data);

        return $this->successResponse(
            $review->fresh()->load(['product:id,name', 'user:id,name']),
            'Review updated successfully.'
        );
    }

    public function toggleVisibility(int $id): JsonResponse
    {
        $review = Review::find($id);

        if (! $review) {
            return $this->notFoundResponse('Review not found.');
        }

        $review->update(['is_visible' => ! $review->is_visible]);

        return $this->successResponse($review->fresh(), 'Review visibility updated.');
    }

    public function delete(int $id): JsonResponse
    {
        $review = Review::find($id);

        if (! $review) {
            return $this->notFoundResponse('Review not found.');
        }

        $review->delete();

        return $this->successResponse(null, 'Review deleted successfully.');
    }
}
