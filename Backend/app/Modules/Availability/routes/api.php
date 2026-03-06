<?php

use App\Modules\Availability\Controllers\AvailabilityController;
use Illuminate\Support\Facades\Route;

Route::get('/availability', [AvailabilityController::class, 'index']);
Route::post('/availability', [AvailabilityController::class, 'store']);
Route::post('/availability/block', [AvailabilityController::class, 'block']);
Route::delete('/availability/block/{date}', [AvailabilityController::class, 'unblock']);
Route::get('/availability/tutor/{tutorId}', [AvailabilityController::class, 'byTutor']);
