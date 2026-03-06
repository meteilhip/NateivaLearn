<?php

namespace App\Modules\Chat\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Chat\Models\Conversation;
use App\Modules\Chat\Models\ConversationParticipant;
use App\Modules\Chat\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends ApiController
{
    public function conversations(): JsonResponse
    {
        $user = request()->user();
        $conversations = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
            ->with(['participants.user:id,name,email', 'messages' => fn ($q) => $q->latest()->limit(1)])
            ->get()
            ->map(function ($c) use ($user) {
                $other = $c->participants->firstWhere('user_id', '!=', $user->id)?->user;
                $last = $c->messages->first();
                return [
                    'id' => $c->id,
                    'participant' => $other ? ['id' => $other->id, 'name' => $other->name, 'email' => $other->email] : null,
                    'last_message' => $last ? ['text' => $last->message, 'sent_at' => $last->created_at->toIso8601String(), 'from_me' => (int) $last->sender_id === (int) $user->id] : null,
                    'unread_count' => 0,
                ];
            });
        return $this->success($conversations);
    }

    public function messages(int $conversationId): JsonResponse
    {
        $user = request()->user();
        $conv = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
            ->findOrFail($conversationId);
        $messages = Message::query()
            ->where('conversation_id', $conv->id)
            ->with('sender:id,name')
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'conversation_id' => $m->conversation_id,
                'sender_id' => $m->sender_id,
                'text' => $m->message,
                'timestamp' => $m->created_at->toIso8601String(),
                'from_me' => (int) $m->sender_id === (int) $user->id,
            ]);
        return $this->success($messages);
    }

    public function send(Request $request): JsonResponse
    {
        $request->validate(['conversation_id' => 'required|exists:conversations,id', 'message' => 'required|string|max:5000']);
        $user = request()->user();
        $conv = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
            ->findOrFail($request->conversation_id);
        $msg = Message::query()->create([
            'conversation_id' => $conv->id,
            'sender_id' => $user->id,
            'message' => $request->message,
        ]);
        $msg->load('sender:id,name');
        return $this->success([
            'id' => $msg->id,
            'conversation_id' => $msg->conversation_id,
            'sender_id' => $msg->sender_id,
            'text' => $msg->message,
            'timestamp' => $msg->created_at->toIso8601String(),
            'from_me' => true,
        ], 201);
    }

    public function findOrCreateConversation(int $otherUserId): JsonResponse
    {
        $user = request()->user();
        $existing = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
            ->whereHas('participants', fn ($q) => $q->where('user_id', $otherUserId))
            ->withCount('participants')
            ->having('participants_count', '=', 2)
            ->first();
        if ($existing) {
            return $this->success($existing->load('participants.user:id,name,email'));
        }
        $conv = Conversation::query()->create([]);
        ConversationParticipant::query()->create(['conversation_id' => $conv->id, 'user_id' => $user->id]);
        ConversationParticipant::query()->create(['conversation_id' => $conv->id, 'user_id' => $otherUserId]);
        return $this->success($conv->load('participants.user:id,name,email'), 201);
    }
}
