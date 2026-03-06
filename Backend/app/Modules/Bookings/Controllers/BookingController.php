<?php

namespace App\Modules\Bookings\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Bookings\Models\Booking;
use App\Modules\Bookings\Requests\StoreBookingRequest;
use App\Modules\Bookings\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BookingController extends ApiController
{
    public function __construct(private BookingService $bookingService) {}

    public function index(): JsonResponse
    {
        $user = request()->user();
        $query = Booking::query()->with(['learner:id,name,email', 'tutor:id,name,email', 'organization:id,name,city']);
        if ($user->role === 'learner') {
            $query->where('learner_id', $user->id);
        } elseif ($user->role === 'tutor') {
            $query->where('tutor_id', $user->id);
        } else {
            $query->where('organization_id', $user->active_organization_id);
        }
        $bookings = $query->orderByDesc('date')->orderByDesc('start_time')->get();
        return $this->success($bookings);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (! $this->bookingService->isAvailable((int) $data['tutor_id'], $data['date'], $data['start_time'], $data['end_time'])) {
            return $this->error('Créneau non disponible', 422);
        }
        if ($this->bookingService->hasConflict((int) $data['tutor_id'], $data['date'], $data['start_time'], $data['end_time'])) {
            return $this->error('Conflit horaire', 422);
        }
        $booking = DB::transaction(function () use ($request, $data) {
            return Booking::query()->create([
                'learner_id' => $request->user()->id,
                'tutor_id' => $data['tutor_id'],
                'organization_id' => $data['organization_id'] ?? null,
                'date' => $data['date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'price' => $data['price'] ?? null,
                'status' => 'pending',
            ]);
        });
        return $this->success($booking->load(['tutor:id,name,email', 'organization:id,name']), 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        $user = request()->user();
        if ($user->role === 'learner' && (int) $booking->learner_id !== (int) $user->id) {
            return $this->error('Forbidden', 403);
        }
        if ($user->role === 'tutor' && (int) $booking->tutor_id !== (int) $user->id) {
            return $this->error('Forbidden', 403);
        }
        $booking->load(['learner', 'tutor', 'organization']);
        return $this->success($booking);
    }

    public function confirm(Booking $booking): JsonResponse
    {
        if ($booking->tutor_id !== request()->user()->id) {
            return $this->error('Forbidden', 403);
        }
        $booking->update(['status' => 'confirmed']);
        return $this->success($booking->fresh());
    }

    public function complete(Booking $booking): JsonResponse
    {
        if ($booking->tutor_id !== request()->user()->id) {
            return $this->error('Forbidden', 403);
        }
        $booking->update(['status' => 'completed']);
        return $this->success($booking->fresh());
    }

    public function cancel(Booking $booking): JsonResponse
    {
        $user = request()->user();
        if ($booking->learner_id !== $user->id && $booking->tutor_id !== $user->id) {
            return $this->error('Forbidden', 403);
        }
        $booking->update(['status' => 'cancelled']);
        return $this->success($booking->fresh());
    }
}
