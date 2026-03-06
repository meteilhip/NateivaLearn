<?php

namespace App\Modules\Quizzes\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'tutor';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'time_limit' => ['nullable', 'integer', 'min:1'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string', 'max:1000'],
            'questions.*.answers' => ['required', 'array', 'min:2'],
            'questions.*.answers.*.answer' => ['required', 'string', 'max:500'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
            'recipient_learner_ids' => ['required', 'array', 'min:1'],
            'recipient_learner_ids.*' => ['exists:users,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $questions = $this->input('questions', []);
            foreach ($questions as $i => $q) {
                $answers = $q['answers'] ?? [];
                $correctCount = collect($answers)->where('is_correct', true)->count();
                if ($correctCount < 1) {
                    $validator->errors()->add("questions.{$i}.answers", 'At least one correct answer required.');
                }
            }
        });
    }
}
