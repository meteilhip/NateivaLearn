<?php

namespace App\Modules\Quizzes\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizRecipient extends Model
{
    protected $fillable = ['quiz_id', 'learner_id', 'completed', 'score'];

    protected $casts = ['completed' => 'boolean'];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function learner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'learner_id');
    }
}
