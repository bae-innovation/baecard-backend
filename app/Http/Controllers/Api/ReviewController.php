<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function index()
    {
        $user = request()->user();

        if ($user && \App\Support\RoleAbility::allows($user, 'reviews.view')) {
            return $this->reviewService->listAdmin();
        }

        return $this->reviewService->list();
    }

    public function show(int $id)
    {
        return $this->reviewService->find($id);
    }

    public function store(StoreReviewRequest $request)
    {
        return $this->reviewService->create($request->validated());
    }

    public function update(int $id, UpdateReviewRequest $request)
    {
        return $this->reviewService->update($id, $request->validated());
    }

    public function toggleVisibility(int $id)
    {
        return $this->reviewService->toggleVisibility($id);
    }

    public function destroy(int $id)
    {
        return $this->reviewService->delete($id);
    }
}
