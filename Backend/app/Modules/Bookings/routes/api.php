<?php

use App\Modules\Bookings\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{booking}', [BookingController::class, 'show']);
Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
Route::post('/bookings/{booking}/complete', [BookingController::class, 'complete']);
Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
