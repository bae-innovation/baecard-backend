<?php

namespace App\Services;

use App\Models\Review;
use App\Support\PermissionResolver;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ReviewService
{
    use ApiResponseTrait;

    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function list(): JsonResponse
    {
        $reviews = Review::with(['user:id,name'])
            ->where('is_visible', true)
            ->latest()
            ->paginate(10);

        return $this->successResponse($reviews, 'Reviews retrieved successfully.');
    }

    public function listAdmin(): JsonResponse
    {
        $reviews = Review::with(['user:id,name'])
            ->latest()
            ->paginate(10);

        return $this->successResponse($reviews, 'Reviews retrieved successfully.');
    }

    public function find(int $id, bool $publicOnly = true): JsonResponse
    {
        $query = Review::with(['user:id,name']);

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

        $imagePath = null;
        if (request()->hasFile('image')) {
            $imagePath = $this->imageUploadService->store(request()->file('image'), 'review');
        }

        $review = Review::create([
            'user_id' => $user?->id,
            'created_by' => $user?->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'image' => $imagePath,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'body' => $data['body'],
            'is_visible' => $this->defaultVisibilityForCreate($user, $data),
        ]);

        return $this->successResponse(
            $review->load(['user:id,name']),
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

        $user = request()->user();

        if ($user && ! $this->canUpdate($user, $review)) {
            return $this->forbiddenResponse('You are not allowed to update this review.');
        }

        if ($user && ! PermissionResolver::allows($user, 'review.review.update')) {
            unset($data['is_visible']);
        }

        if (request()->hasFile('image')) {
            $data['image'] = $this->imageUploadService->replace(
                request()->file('image'),
                $review->image,
                'review'
            );
        }

        $review->update($data);

        return $this->successResponse(
            $review->fresh()->load(['user:id,name']),
            'Review updated successfully.'
        );
    }

    public function toggleVisibility(int $id): JsonResponse
    {
        $user = request()->user();

        if (! $user || ! PermissionResolver::allows($user, 'review.review.update')) {
            return $this->forbiddenResponse('You are not allowed to update review visibility.');
        }

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

        $user = request()->user();

        if ($user && ! $this->canDelete($user, $review)) {
            return $this->forbiddenResponse('You are not allowed to delete this review.');
        }

        $this->imageUploadService->delete($review->image);
        $review->delete();

        return $this->successResponse(null, 'Review deleted successfully.');
    }

    public function canUpdate($user, Review $review): bool
    {
        if (PermissionResolver::allows($user, 'review.review.update')) {
            return true;
        }

        return PermissionResolver::allows($user, 'review.review.update_own')
            && $this->ownsReview($user, $review);
    }

    public function canDelete($user, Review $review): bool
    {
        if (PermissionResolver::allows($user, 'review.review.delete')) {
            return true;
        }

        return PermissionResolver::allows($user, 'review.review.delete_own')
            && $this->ownsReview($user, $review);
    }

    public function ownsReview($user, Review $review): bool
    {
        return (int) $review->created_by === (int) $user->id;
    }

    private function defaultVisibilityForCreate(?\App\Models\User $user, array $data): bool
    {
        if ($user && PermissionResolver::allows($user, 'review.review.update')) {
            return (bool) ($data['is_visible'] ?? true);
        }

        return false;
    }
}
