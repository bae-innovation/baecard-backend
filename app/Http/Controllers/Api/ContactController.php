<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Services\ContactService;

class ContactController extends Controller
{
    public function __construct(
        protected ContactService $contactService
    ) {}

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
        return $this->contactService->create($request->validated());
    }

    public function markRead(int $id)
    {
        return $this->contactService->markRead($id);
    }

    public function destroy(int $id)
    {
        return $this->contactService->delete($id);
    }
}
