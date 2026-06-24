<?php

namespace App\Services;

use App\Models\Contact;
use App\Support\RoleAbility;
use App\Traits\ApiResponseTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class ContactService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $contacts = $this->scopedQuery()->latest()->paginate(10);

        return $this->successResponse($contacts, 'Contacts retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $contact = $this->scopedQuery()->find($id);

        if (! $contact) {
            return $this->notFoundResponse('Contact not found.');
        }

        return $this->successResponse($contact, 'Contact retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $user = request()->user();

        $contact = Contact::create([
            'user_id' => $user?->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'message' => $data['message'],
            'ip_address' => request()->ip(),
        ]);

        return $this->successResponse($contact, 'Contact submitted successfully.', 201);
    }

    public function markRead(int $id): JsonResponse
    {
        $contact = $this->scopedQuery()->find($id);

        if (! $contact) {
            return $this->notFoundResponse('Contact not found.');
        }

        $contact->update(['is_read' => true]);

        return $this->successResponse($contact->fresh(), 'Contact marked as read.');
    }

    public function delete(int $id): JsonResponse
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return $this->notFoundResponse('Contact not found.');
        }

        $contact->delete();

        return $this->successResponse(null, 'Contact deleted successfully.');
    }

    public function scopedQuery(): Builder
    {
        $query = Contact::query();
        $user = request()->user();

        if ($user && ! RoleAbility::allows($user, 'contacts.view')) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }
}
