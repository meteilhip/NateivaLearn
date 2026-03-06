<?php

namespace App\Modules\Users\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorProfile extends Model
{
    protected $fillable = ['user_id', 'bio', 'hourly_rate', 'languages', 'subjects', 'video_url', 'rating'];

    protected $casts = [
        'languages' => 'array',
        'subjects' => 'array',
        'rating' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
