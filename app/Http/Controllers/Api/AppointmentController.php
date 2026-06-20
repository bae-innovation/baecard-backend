<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Requests\Appointment\UpdateAppointmentRequest;
use App\Services\AppointmentService;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentService $appointmentService
    ) {}

    public function index()
    {
        return $this->appointmentService->list();
    }

    public function show(int $id)
    {
        return $this->appointmentService->find($id);
    }

    public function store(StoreAppointmentRequest $request)
    {
        return $this->appointmentService->create($request->validated());
    }

    public function update(int $id, UpdateAppointmentRequest $request)
    {
        return $this->appointmentService->update($id, $request->validated());
    }

    public function destroy(int $id)
    {
        return $this->appointmentService->delete($id);
    }
}
