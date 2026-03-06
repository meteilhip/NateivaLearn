<?php

namespace App\Modules\Quizzes\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    protected $fillable = ['tutor_id', 'title', 'description', 'time_limit'];

    protected $casts = ['time_limit' => 'integer'];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(QuizRecipient::class);
    }
}
