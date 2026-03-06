<?php

namespace App\Modules\Bookings\Services;

use App\Modules\Availability\Models\BlockedDate;
use App\Modules\Availability\Models\TutorAvailability;
use App\Modules\Bookings\Models\Booking;
use Carbon\Carbon;

class BookingService
{
    public function hasConflict(int $tutorId, string $date, string $startTime, string $endTime, ?int $excludeBookingId = null): bool
    {
        $q = Booking::query()
            ->where('tutor_id', $tutorId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)->where('end_time', '>=', $endTime);
                    });
            });
        if ($excludeBookingId) {
            $q->where('id', '!=', $excludeBookingId);
        }
        return $q->exists();
    }

    public function isAvailable(int $tutorId, string $date, string $startTime, string $endTime): bool
    {
        $dateObj = Carbon::parse($date);
        $dayOfWeek = (int) $dateObj->format('w');
        $hasSlot = TutorAvailability::query()
            ->where('tutor_id', $tutorId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>=', $endTime)
            ->exists();
        if (! $hasSlot) {
            return false;
        }
        $blocked = BlockedDate::query()
            ->where('tutor_id', $tutorId)
            ->whereDate('date', $date)
            ->exists();
        return ! $blocked;
    }
}
