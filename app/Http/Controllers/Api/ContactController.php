<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Models\Contact;
use App\Services\ContactService;
use App\Support\InertiaData;
use App\Support\RoleAbility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ContactService $contactService
    ) {}

    public function indexPage(Request $request)
    {
        $user = $request->user();
        $query = Contact::query()->latest();

        if ($user && ! RoleAbility::allows($user, 'contacts.view')) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Contacts/Index', [
            'contacts' => InertiaData::paginate(
                $query->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function index()
    {
        return $this->contactService->list();
    }

    public function show(int $id)
    {
        return $this->contactService->find($id);
    }

    public function store(StoreContactRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->contactService->create($request->validated()),
            'contacts.index',
            'Contact submitted.',
        );
    }

    public function markRead(Request $request, Contact $contact)
    {
        return $this->webOrJson(
            $request,
            $this->contactService->markRead($contact->id),
            'contacts.index',
            'Contact marked as read.',
        );
    }

    public function destroy(Request $request, Contact $contact)
    {
        return $this->webOrJson(
            $request,
            $this->contactService->delete($contact->id),
            'contacts.index',
            'Contact deleted.',
        );
    }
}
