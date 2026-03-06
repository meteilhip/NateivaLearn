<?php

namespace App\Modules\Availability\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Availability\Models\BlockedDate;
use App\Modules\Availability\Models\TutorAvailability;
use App\Modules\Availability\Requests\StoreAvailabilityRequest;
use App\Modules\Availability\Requests\StoreBlockedDateRequest;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends ApiController
{
    public function index(): JsonResponse
    {
        $user = request()->user();
        if ($user->role !== 'tutor') {
            return $this->error('Forbidden', 403);
        }
        $slots = TutorAvailability::query()->where('tutor_id', $user->id)->get();
        $blocked = BlockedDate::query()->where('tutor_id', $user->id)->get()->map(fn ($b) => $b->date->format('Y-m-d'));
        return $this->success(['slots' => $slots, 'blocked_dates' => $blocked]);
    }

    public function store(StoreAvailabilityRequest $request): JsonResponse
    {
        $user = request()->user();
        TutorAvailability::query()->where('tutor_id', $user->id)->delete();
        $slots = $request->validated('slots') ?? [];

        foreach ($slots as $slot) {
            TutorAvailability::query()->create([
                'tutor_id' => $user->id,
                'day_of_week' => $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
            ]);
        }
        return $this->success(TutorAvailability::query()->where('tutor_id', $user->id)->get(), 201);
    }

    public function block(StoreBlockedDateRequest $request): JsonResponse
    {
        $user = request()->user();
        $blocked = BlockedDate::query()->firstOrCreate(
            ['tutor_id' => $user->id, 'date' => $request->validated('date')],
            ['tutor_id' => $user->id, 'date' => $request->validated('date')]
        );
        return $this->success($blocked, 201);
    }

    public function unblock(string $date): JsonResponse
    {
        $user = request()->user();
        BlockedDate::query()->where('tutor_id', $user->id)->whereDate('date', $date)->delete();
        return $this->success(['message' => 'Unblocked']);
    }

    public function byTutor(int $tutorId): JsonResponse
    {
        $slots = TutorAvailability::query()->where('tutor_id', $tutorId)->get();
        $blocked = BlockedDate::query()->where('tutor_id', $tutorId)->get()->map(fn ($b) => $b->date->format('Y-m-d'));
        return $this->success(['slots' => $slots, 'blocked_dates' => $blocked]);
    }
}
