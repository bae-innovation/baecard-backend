<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Models\Review;
use App\Services\ReviewService;
use App\Support\InertiaData;
use App\Support\RoleAbility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function indexPage(Request $request)
    {
        $user = $request->user();
        $query = Review::with(['user:id,name']);

        if (! $user || ! RoleAbility::allows($user, 'reviews.view')) {
            $query->where('is_visible', true);
        }

        return Inertia::render('Reviews/Index', [
            'reviews' => InertiaData::paginate(
                $query->latest()->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function index()
    {
        $user = request()->user();

        if ($user && RoleAbility::allows($user, 'reviews.view')) {
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
        return $this->webOrJson(
            $request,
            $this->reviewService->create($request->validated()),
            'reviews.index',
            'Review created.',
        );
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        return $this->webOrJson(
            $request,
            $this->reviewService->update($review->id, $request->validated()),
            'reviews.index',
            'Review updated.',
        );
    }

    public function toggleVisibility(Request $request, Review $review)
    {
        return $this->webOrJson(
            $request,
            $this->reviewService->toggleVisibility($review->id),
            'reviews.index',
            'Review visibility updated.',
        );
    }

    public function destroy(Request $request, Review $review)
    {
        return $this->webOrJson(
            $request,
            $this->reviewService->delete($review->id),
            'reviews.index',
            'Review deleted.',
        );
    }
}
