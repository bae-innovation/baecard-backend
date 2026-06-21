<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected CardService $cardService
    ) {}

    public function indexPage()
    {
        return Inertia::render('Dashboard/Index');
    }

    public function cardsPage()
    {
        return Inertia::render('Cards/Index', $this->cardService->getListData());
    }

    public function index()
    {
        return $this->cardService->list();
    }

    public function show(int $id)
    {
        return $this->cardService->find($id);
    }

    public function generate(Request $request, User $user)
    {
        return $this->webOrJson(
            $request,
            $this->cardService->assignToUser($user->id),
            'cards.index',
            'Business card generated.',
        );
    }

    public function regenerate(Request $request, User $user)
    {
        return $this->webOrJson(
            $request,
            $this->cardService->regenerateForUser($user->id),
            'cards.index',
            'Business card regenerated.',
        );
    }
}
