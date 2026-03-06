<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use App\Modules\Users\Models\TutorProfile;
use Illuminate\Http\JsonResponse;

class TutorController extends ApiController
{
    public function index(): JsonResponse
    {
        $query = User::query()
            ->whereIn('role', ['tutor', 'center_owner'])
            ->whereHas('tutorProfile')
            ->with('tutorProfile');
        if (request()->has('city')) {
            $query->where('city', request()->query('city'));
        }
        if (request()->has('subject')) {
            $query->whereHas('tutorProfile', fn ($q) => $q->whereJsonContains('subjects', request()->query('subject')));
        }
        $tutors = $query->get()->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'city' => $u->city,
            'tutor_profile' => $u->tutorProfile?->only(['bio', 'hourly_rate', 'languages', 'subjects', 'rating']),
        ]);
        return $this->success($tutors);
    }

    public function show(int $id): JsonResponse
    {
        $tutor = User::query()
            ->whereIn('role', ['tutor', 'center_owner'])
            ->where('id', $id)
            ->with('tutorProfile')
            ->firstOrFail();
        return $this->success([
            'id' => $tutor->id,
            'name' => $tutor->name,
            'email' => $tutor->email,
            'phone' => $tutor->phone,
            'city' => $tutor->city,
            'tutor_profile' => $tutor->tutorProfile,
        ]);
    }
}
