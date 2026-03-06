<?php

namespace App\Modules\Availability\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockedDate extends Model
{
    protected $fillable = ['tutor_id', 'date'];

    protected $casts = ['date' => 'date'];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
