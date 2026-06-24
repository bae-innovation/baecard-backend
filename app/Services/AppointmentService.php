<?php

namespace App\Services;

use App\Models\Appointment;
use App\Support\RoleAbility;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class AppointmentService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $user = request()->user();
        $query = Appointment::with(['customer:id,name,email', 'creator:id,name']);

        if ($user && ! RoleAbility::allows($user, 'appointments.view')) {
            $query->where('customer_id', $user->id);
        }

        $appointments = $query->latest('appointment_date')->paginate(10);

        return $this->successResponse($appointments, 'Appointments retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $appointment = Appointment::with(['customer:id,name,email', 'creator:id,name'])->find($id);

        if (! $appointment) {
            return $this->notFoundResponse('Appointment not found.');
        }

        $user = request()->user();

        if ($user && ! $this->canAccess($user, $appointment)) {
            return $this->forbiddenResponse('You are not allowed to view this appointment.');
        }

        return $this->successResponse($appointment, 'Appointment retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        $user = request()->user();
        $customerId = ! empty($data['customer_id']) ? (int) $data['customer_id'] : $user?->id;

        if (! $customerId) {
            return $this->errorResponse('Customer is required.', null, 422);
        }

        if ($user && ! RoleAbility::allows($user, 'appointments.manage') && $user->id !== (int) $customerId) {
            return $this->forbiddenResponse('You can only create appointments for yourself.');
        }

        $appointment = Appointment::create([
            'customer_id' => $customerId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'appointment_date' => $data['appointment_date'],
            'duration_minutes' => $data['duration_minutes'] ?? 60,
            'status' => $data['status'] ?? 'pending',
            'location' => $data['location'] ?? null,
            'notes' => $data['notes'] ?? null,
            'created_by' => $user?->id,
        ]);

        return $this->successResponse(
            $appointment->load(['customer:id,name,email']),
            'Appointment created successfully.',
            201
        );
    }

    public function update(int $id, array $data): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (! $appointment) {
            return $this->notFoundResponse('Appointment not found.');
        }

        $user = request()->user();

        if ($user && ! $this->canManage($user, $appointment)) {
            return $this->forbiddenResponse('You are not allowed to update this appointment.');
        }

        if ($user && ! RoleAbility::allows($user, 'appointments.manage')) {
            unset($data['customer_id'], $data['status']);
        }

        $appointment->update($data);

        return $this->successResponse(
            $appointment->fresh()->load(['customer:id,name,email']),
            'Appointment updated successfully.'
        );
    }

    public function delete(int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (! $appointment) {
            return $this->notFoundResponse('Appointment not found.');
        }

        $user = request()->user();

        if ($user && ! $this->canManage($user, $appointment)) {
            return $this->forbiddenResponse('You are not allowed to delete this appointment.');
        }

        $appointment->delete();

        return $this->successResponse(null, 'Appointment deleted successfully.');
    }

    private function canAccess($user, Appointment $appointment): bool
    {
        if (RoleAbility::allows($user, 'appointments.view')) {
            return true;
        }

        return $user->id === $appointment->customer_id;
    }

    private function canManage($user, Appointment $appointment): bool
    {
        return RoleAbility::allows($user, 'appointments.manage');
    }
}
