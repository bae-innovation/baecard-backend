<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Requests\Appointment\StorePublicAppointmentRequest;
use App\Http\Requests\Appointment\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\Customer;
use App\Services\AppointmentService;
use App\Support\InertiaData;
use App\Support\PermissionResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected AppointmentService $appointmentService
    ) {}

    public function indexPage(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with(['customer:id,name,email', 'creator:id,name']);

        if ($user && ! PermissionResolver::allows($user, 'appointment.appointment.view')) {
            $query->where('created_by', $user->id);
        }

        return Inertia::render('Appointments/Index', [
            'appointments' => InertiaData::paginate(
                $query->latest('appointment_date')->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function createPage(Request $request)
    {
        $user = $request->user();
        $canAssignCustomer = PermissionResolver::allowsAny($user, [
            'appointment.appointment.create',
            'appointment.appointment.update',
        ]);

        return Inertia::render('Appointments/Create', [
            'customers' => $canAssignCustomer
                ? Customer::query()->select('id', 'name', 'email')->orderBy('name')->get()
                : [],
            'canManage' => $canAssignCustomer,
        ]);
    }

    public function editPage(Request $request, Appointment $appointment)
    {
        $appointment->load(['customer:id,name,email', 'creator:id,name']);
        $user = $request->user();

        if ($user && ! $this->appointmentService->canUpdate($user, $appointment)) {
            abort(403);
        }

        $canAssignCustomer = PermissionResolver::allowsAny($user, [
            'appointment.appointment.create',
            'appointment.appointment.update',
        ]);

        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'customers' => $canAssignCustomer
                ? Customer::query()->select('id', 'name', 'email')->orderBy('name')->get()
                : [],
            'canManage' => $canAssignCustomer,
        ]);
    }

    public function index()
    {
        return $this->appointmentService->list();
    }

    public function show(int $id)
    {
        return $this->appointmentService->find($id);
    }

    public function storePublic(StorePublicAppointmentRequest $request)
    {
        return $this->appointmentService->createPublic($request->validated());
    }

    public function store(StoreAppointmentRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->appointmentService->create($request->validated()),
            'appointments.index',
            'Appointment created.',
        );
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        return $this->webOrJson(
            $request,
            $this->appointmentService->update($appointment->id, $request->validated()),
            'appointments.index',
            'Appointment updated.',
        );
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        return $this->webOrJson(
            $request,
            $this->appointmentService->delete($appointment->id),
            'appointments.index',
            'Appointment deleted.',
        );
    }
}
