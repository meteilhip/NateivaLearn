<?php

namespace App\Modules\Notifications\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Notifications\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends ApiController
{
    public function index(): JsonResponse
    {
        $user = request()->user();
        $notifications = Notification::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'body' => $n->body,
                'read' => $n->read_at !== null,
                'timestamp' => $n->created_at->toIso8601String(),
            ]);
        return $this->success($notifications);
    }

    public function markRead(int $id): JsonResponse
    {
        $n = Notification::query()->where('user_id', request()->user()->id)->findOrFail($id);
        $n->update(['read_at' => now()]);
        return $this->success($n->fresh());
    }

    public function markAllRead(): JsonResponse
    {
        Notification::query()
            ->where('user_id', request()->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        return $this->success(['message' => 'All marked as read']);
    }

    public function unreadCount(): JsonResponse
    {
        $count = Notification::query()
            ->where('user_id', request()->user()->id)
            ->whereNull('read_at')
            ->count();
        return $this->success(['count' => $count]);
    }
}
