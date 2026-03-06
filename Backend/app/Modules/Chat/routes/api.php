<?php

use App\Modules\Chat\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::get('/conversations', [ChatController::class, 'conversations']);
Route::get('/conversations/{conversationId}/messages', [ChatController::class, 'messages']);
Route::post('/messages', [ChatController::class, 'send']);
Route::post('/conversations/find-or-create/{otherUserId}', [ChatController::class, 'findOrCreateConversation']);
