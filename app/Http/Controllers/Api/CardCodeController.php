<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
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
        return Inertia::render('Cards/Codes', [
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
            'cards.codes.index',
            'Card code created.',
        );
    }

    public function destroy(Request $request, CardCode $cardCode)
    {
        return $this->webOrJson(
            $request,
            $this->cardCodeService->delete($cardCode->id),
            'cards.codes.index',
            'Card code deleted.',
        );
    }
}
