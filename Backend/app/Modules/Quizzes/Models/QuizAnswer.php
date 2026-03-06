<?php

namespace App\Modules\Quizzes\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    protected $fillable = ['question_id', 'answer', 'is_correct'];

    protected $casts = ['is_correct' => 'boolean'];

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id');
    }
}
