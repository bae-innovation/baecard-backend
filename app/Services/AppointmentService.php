<?php

namespace App\Services;

use App\Models\Appointment;
use App\Support\PermissionResolver;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class AppointmentService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $user = request()->user();
        $query = Appointment::with(['customer:id,name,email', 'creator:id,name']);

        if ($user && ! PermissionResolver::allows($user, 'appointment.appointment.view')) {
            $query->where('created_by', $user->id);
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

    public function createPublic(array $data): JsonResponse
    {
        $appointment = Appointment::create([
            'customer_id' => null,
            'guest_name' => $data['guest_name'],
            'guest_phone' => $data['guest_phone'],
            'guest_email' => $data['guest_email'] ?? null,
            'title' => 'Website Booking',
            'description' => null,
            'appointment_date' => $data['appointment_date'],
            'duration_minutes' => 60,
            'status' => 'pending',
            'location' => null,
            'notes' => $data['notes'] ?? null,
            'created_by' => null,
        ]);

        return $this->successResponse(
            $appointment,
            'Appointment request submitted successfully.',
            201
        );
    }

    public function create(array $data): JsonResponse
    {
        $user = request()->user();
        $customerId = ! empty($data['customer_id']) ? (int) $data['customer_id'] : $user?->id;

        if (! $customerId) {
            return $this->errorResponse('Customer is required.', null, 422);
        }

        if (
            $user
            && $customerId !== (int) $user->id
            && ! PermissionResolver::allows($user, 'appointment.appointment.create')
        ) {
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

        if ($user && ! $this->canUpdate($user, $appointment)) {
            return $this->forbiddenResponse('You are not allowed to update this appointment.');
        }

        if ($user && ! PermissionResolver::allows($user, 'appointment.appointment.update')) {
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

        if ($user && ! $this->canDelete($user, $appointment)) {
            return $this->forbiddenResponse('You are not allowed to delete this appointment.');
        }

        $appointment->delete();

        return $this->successResponse(null, 'Appointment deleted successfully.');
    }

    public function canAccess($user, Appointment $appointment): bool
    {
        if (PermissionResolver::allows($user, 'appointment.appointment.view')) {
            return true;
        }

        return PermissionResolver::allows($user, 'appointment.appointment.view_own')
            && $this->ownsAppointment($user, $appointment);
    }

    public function canUpdate($user, Appointment $appointment): bool
    {
        if (PermissionResolver::allows($user, 'appointment.appointment.update')) {
            return true;
        }

        return PermissionResolver::allows($user, 'appointment.appointment.update_own')
            && $this->ownsAppointment($user, $appointment);
    }

    public function canDelete($user, Appointment $appointment): bool
    {
        if (PermissionResolver::allows($user, 'appointment.appointment.delete')) {
            return true;
        }

        return PermissionResolver::allows($user, 'appointment.appointment.delete_own')
            && $this->ownsAppointment($user, $appointment);
    }

    private function ownsAppointment($user, Appointment $appointment): bool
    {
        return (int) $appointment->created_by === (int) $user->id;
    }
}
