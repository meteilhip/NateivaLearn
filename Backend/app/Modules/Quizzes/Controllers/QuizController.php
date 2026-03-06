<?php

namespace App\Modules\Quizzes\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Quizzes\Models\Quiz;
use App\Modules\Quizzes\Models\QuizQuestion;
use App\Modules\Quizzes\Models\QuizAnswer;
use App\Modules\Quizzes\Models\QuizRecipient;
use App\Modules\Quizzes\Requests\StoreQuizRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuizController extends ApiController
{
    public function index(): JsonResponse
    {
        $user = request()->user();
        if ($user->role === 'tutor') {
            $quizzes = Quiz::query()->where('tutor_id', $user->id)->with('questions.answers')->get();
        } else {
            $quizzes = QuizRecipient::query()
                ->where('learner_id', $user->id)
                ->with('quiz.tutor:id,name', 'quiz.questions.answers')
                ->get()
                ->map(fn ($r) => array_merge($r->quiz->toArray(), ['recipient' => $r->only(['id', 'completed', 'score'])]));
        }
        return $this->success($quizzes);
    }

    public function store(StoreQuizRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $quiz = DB::transaction(function () use ($user, $data) {
            $quiz = Quiz::query()->create([
                'tutor_id' => $user->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'time_limit' => $data['time_limit'] ?? null,
            ]);
            foreach ($data['questions'] as $q) {
                $question = QuizQuestion::query()->create(['quiz_id' => $quiz->id, 'question' => $q['question']]);
                foreach ($q['answers'] as $a) {
                    QuizAnswer::query()->create([
                        'question_id' => $question->id,
                        'answer' => $a['answer'],
                        'is_correct' => $a['is_correct'],
                    ]);
                }
            }
            foreach ($data['recipient_learner_ids'] as $learnerId) {
                QuizRecipient::query()->create(['quiz_id' => $quiz->id, 'learner_id' => $learnerId]);
            }
            return $quiz->load('questions.answers');
        });
        return $this->success($quiz, 201);
    }

    public function show(Quiz $quiz): JsonResponse
    {
        $user = request()->user();
        if ($user->role === 'tutor' && (int) $quiz->tutor_id !== (int) $user->id) {
            return $this->error('Forbidden', 403);
        }
        if ($user->role === 'learner') {
            $recipient = QuizRecipient::query()->where('quiz_id', $quiz->id)->where('learner_id', $user->id)->first();
            if (! $recipient) {
                return $this->error('Forbidden', 403);
            }
        }
        $quiz->load(['tutor:id,name', 'questions.answers']);
        return $this->success($quiz);
    }

    public function submit(int $quizId): JsonResponse
    {
        $user = request()->user();
        $recipient = QuizRecipient::query()->where('quiz_id', $quizId)->where('learner_id', $user->id)->firstOrFail();
        if ($recipient->completed) {
            return $this->error('Already completed', 422);
        }
        $answers = request()->input('answers', []); // [{ question_id: 1, answer_id: 2 }, ...]
        $quiz = Quiz::query()->with('questions.answers')->findOrFail($quizId);
        $correct = 0;
        $total = $quiz->questions->count();
        foreach ($quiz->questions as $q) {
            $chosen = collect($answers)->firstWhere('question_id', $q->id);
            if ($chosen && $q->answers->where('id', $chosen['answer_id'])->where('is_correct', true)->isNotEmpty()) {
                $correct++;
            }
        }
        $score = $total > 0 ? (int) round($correct / $total * 100) : 0;
        $recipient->update(['completed' => true, 'score' => $score]);
        return $this->success(['score' => $score, 'total' => $total]);
    }
}
