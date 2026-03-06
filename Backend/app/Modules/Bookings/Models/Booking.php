<?php

namespace App\Modules\Bookings\Models;

use App\Models\User;
use App\Modules\Organizations\Models\Organization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'learner_id', 'tutor_id', 'organization_id',
        'date', 'start_time', 'end_time', 'price', 'status', 'review_given',
    ];

    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
        'review_given' => 'boolean',
    ];

    public function learner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'learner_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
