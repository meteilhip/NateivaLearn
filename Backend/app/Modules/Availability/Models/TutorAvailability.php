<?php

namespace App\Modules\Availability\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorAvailability extends Model
{
    protected $fillable = ['tutor_id', 'day_of_week', 'start_time', 'end_time'];

    protected $casts = ['day_of_week' => 'integer'];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
