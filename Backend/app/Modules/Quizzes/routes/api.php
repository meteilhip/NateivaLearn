<?php

use App\Modules\Quizzes\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

Route::get('/quizzes', [QuizController::class, 'index']);
Route::post('/quizzes', [QuizController::class, 'store']);
Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
Route::post('/quizzes/{quizId}/submit', [QuizController::class, 'submit']);
