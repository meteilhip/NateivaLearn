<?php

use App\Modules\Notifications\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
