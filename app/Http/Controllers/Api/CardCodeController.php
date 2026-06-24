<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\CardCode\AssignCardCodeUserRequest;
use App\Http\Requests\CardCode\SearchCardCodeUserRequest;
use App\Http\Requests\CardCode\StoreCardCodeRequest;
use App\Models\CardCode;
use App\Services\CardCodeService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CardCodeController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('Cards/Index', [
            'codes' => InertiaData::paginate(
                $this->cardCodeService->listPaginated($request->integer('per_page', 15))
            ),
        ]);
    }

    public function generateCode()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'code' => $this->cardCodeService->generateUniqueCode(),
            ],
        ]);
    }

    public function store(StoreCardCodeRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->cardCodeService->create($request->validated()),
            'cards.index',
            'Card code created.',
        );
    }

    public function destroy(Request $request, CardCode $cardCode)
    {
        return $this->webOrJson(
            $request,
            $this->cardCodeService->delete($cardCode->id),
            'cards.index',
            'Card code deleted.',
        );
    }

    public function searchUsers(SearchCardCodeUserRequest $request)
    {
        return $this->cardCodeService->searchCustomers(
            $request->validated('email'),
            $request->validated('phone'),
        );
    }

    public function showPublic(string $code)
    {
        return $this->cardCodeService->findByCodePublic($code);
    }

    public function assignUser(
        AssignCardCodeUserRequest $request,
        CardCode $cardCode,
    ) {
        return $this->webOrJson(
            $request,
            $this->cardCodeService->assignUser(
                $cardCode->id,
                (int) $request->validated('user_id'),
            ),
            'cards.index',
            'User assigned to card code.',
        );
    }
}
