<?php

use App\Modules\Users\Controllers\UserController;
use App\Modules\Users\Controllers\TutorController;
use Illuminate\Support\Facades\Route;

Route::get('/user/profile', [UserController::class, 'profile']);
Route::put('/user/profile', [UserController::class, 'updateProfile']);
Route::put('/user/active-organization/{organizationId}', [UserController::class, 'setActiveOrganization']);
Route::get('/tutors', [TutorController::class, 'index']);
Route::get('/tutors/{id}', [TutorController::class, 'show']);
