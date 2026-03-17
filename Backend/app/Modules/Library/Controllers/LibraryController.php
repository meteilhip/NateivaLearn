<?php

namespace App\Modules\Library\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Library\Models\LibraryFile;
use App\Modules\Library\Models\LibraryFolder;
use App\Modules\Library\Models\LibraryShare;
use App\Modules\Library\Requests\ShareRequest;
use App\Modules\Library\Requests\StoreFileRequest;
use App\Modules\Library\Requests\StoreFolderRequest;
use App\Modules\Notifications\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LibraryController extends ApiController
{
    public function index(): JsonResponse
    {
        $user = request()->user();
        $userId = $user->id;

        $folders = LibraryFolder::query()
            ->where('user_id', $userId)
            ->with(['children' => fn ($q) => $q->where('user_id', $userId)], 'files')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        $files = LibraryFile::query()
            ->where('user_id', $userId)
            ->whereNull('folder_id')
            ->orderBy('name')
            ->get()
            ->map(fn ($f) => $this->mapFile($f, false));

        $shared = LibraryShare::query()
            ->where('recipient_id', $userId)
            ->with('sender:id,name')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($s) {
                $shareable = $s->shareable_type === 'folder'
                    ? LibraryFolder::with('files')->find($s->shareable_id)
                    : LibraryFile::find($s->shareable_id);
                if (! $shareable) {
                    return null;
                }
                return [
                    'share_id' => $s->id,
                    'sender_id' => $s->sender_id,
                    'sender_name' => $s->sender?->name,
                    'shareable_type' => $s->shareable_type,
                    'shareable' => $s->shareable_type === 'folder'
                        ? $this->mapFolder($shareable, true)
                        : $this->mapFile($shareable, true),
                ];
            })
            ->filter()
            ->values();

        $tree = $folders->map(fn ($f) => $this->mapFolder($f, false));

        return $this->success([
            'folders' => $tree,
            'files' => $files,
            'shared' => $shared,
        ]);
    }

    public function storeFolder(StoreFolderRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();
        if (! empty($data['parent_id'])) {
            LibraryFolder::where('user_id', $user->id)->findOrFail($data['parent_id']);
        }
        $folder = LibraryFolder::query()->create([
            'user_id' => $user->id,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
        ]);
        return $this->success($this->mapFolder($folder->load('files'), false), 201);
    }

    public function storeFile(StoreFileRequest $request): JsonResponse
    {
        $user = $request->user();
        $upload = $request->file('file');
        $folderId = $request->input('folder_id');

        if ($folderId) {
            LibraryFolder::where('user_id', $user->id)->findOrFail($folderId);
        }

        $mime = $upload->getMimeType();
        $category = $this->categoryFromMime($mime);
        $path = $upload->store('library/'.$user->id, 'local');

        $file = LibraryFile::query()->create([
            'user_id' => $user->id,
            'folder_id' => $folderId,
            'name' => $upload->getClientOriginalName(),
            'storage_path' => $path,
            'category' => $category,
            'mime_type' => $mime,
            'size' => $upload->getSize(),
        ]);

        return $this->success($this->mapFile($file, false), 201);
    }

    public function share(ShareRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ((int) $data['recipient_id'] === (int) $user->id) {
            return $this->error('Vous ne pouvez pas partager avec vous-même', 422);
        }

        if ($data['shareable_type'] === 'folder') {
            $item = LibraryFolder::where('user_id', $user->id)->findOrFail($data['shareable_id']);
        } else {
            $item = LibraryFile::where('user_id', $user->id)->findOrFail($data['shareable_id']);
        }

        $existing = LibraryShare::query()
            ->where('recipient_id', $data['recipient_id'])
            ->where('shareable_type', $data['shareable_type'])
            ->where('shareable_id', $data['shareable_id'])
            ->exists();
        if ($existing) {
            return $this->error('Déjà partagé avec cet utilisateur', 422);
        }

        $share = LibraryShare::query()->create([
            'sender_id' => $user->id,
            'recipient_id' => $data['recipient_id'],
            'shareable_type' => $data['shareable_type'],
            'shareable_id' => $data['shareable_id'],
        ]);

        $itemName = $item->name;
        Notification::query()->create([
            'user_id' => $data['recipient_id'],
            'title' => 'Fichier reçu',
            'body' => $user->name.' vous a envoyé un élément dans votre librairie : '.$itemName,
        ]);

        return $this->success([
            'share_id' => $share->id,
            'recipient_id' => $share->recipient_id,
        ], 201);
    }

    public function download(int $id): JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = request()->user();
        $file = LibraryFile::query()->findOrFail($id);

        $allowed = (int) $file->user_id === (int) $user->id
            || LibraryShare::query()
                ->where('recipient_id', $user->id)
                ->where('shareable_type', 'file')
                ->where('shareable_id', $file->id)
                ->exists();

        if (! $allowed) {
            $folder = $file->folder_id ? LibraryFolder::find($file->folder_id) : null;
            if ($folder) {
                $allowed = LibraryShare::query()
                    ->where('recipient_id', $user->id)
                    ->where('shareable_type', 'folder')
                    ->where('shareable_id', $folder->id)
                    ->exists();
            }
        }

        if (! $allowed) {
            return $this->error('Non autorisé', 403);
        }

        if (! Storage::disk('local')->exists($file->storage_path)) {
            return $this->error('Fichier introuvable', 404);
        }

        return response()->streamDownload(
            function () use ($file) {
                $stream = Storage::disk('local')->readStream($file->storage_path);
                fpassthru($stream);
                fclose($stream);
            },
            $file->name,
            [
                'Content-Type' => $file->mime_type ?? 'application/octet-stream',
            ]
        );
    }

    public function destroyFile(int $id): JsonResponse
    {
        $file = LibraryFile::where('user_id', request()->user()->id)->findOrFail($id);
        Storage::disk('local')->delete($file->storage_path);
        $file->delete();
        return $this->success(['message' => 'Supprimé']);
    }

    public function destroyFolder(int $id): JsonResponse
    {
        $folder = LibraryFolder::where('user_id', request()->user()->id)->findOrFail($id);
        $this->deleteFolderRecursive($folder);
        return $this->success(['message' => 'Supprimé']);
    }

    private function deleteFolderRecursive(LibraryFolder $folder): void
    {
        foreach ($folder->files as $file) {
            Storage::disk('local')->delete($file->storage_path);
            $file->delete();
        }
        foreach ($folder->children as $child) {
            $this->deleteFolderRecursive($child);
        }
        $folder->delete();
    }

    private function categoryFromMime(string $mime): string
    {
        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }
        if (str_starts_with($mime, 'image/')) {
            return 'image';
        }
        return 'document';
    }

    private function mapFolder(LibraryFolder $f, bool $shared): array
    {
        return [
            'id' => $f->id,
            'name' => $f->name,
            'parent_id' => $f->parent_id,
            'children' => $f->relationLoaded('children') ? $f->children->map(fn ($c) => $this->mapFolder($c, $shared))->values() : [],
            'files' => $f->relationLoaded('files') ? $f->files->map(fn ($file) => $this->mapFile($file, $shared))->values() : [],
            'shared' => $shared,
        ];
    }

    private function mapFile(LibraryFile $f, bool $shared): array
    {
        return [
            'id' => $f->id,
            'name' => $f->name,
            'folder_id' => $f->folder_id,
            'category' => $f->category,
            'mime_type' => $f->mime_type,
            'size' => $f->size,
            'url' => '/api/library/files/'.$f->id.'/download',
            'shared' => $shared,
        ];
    }
}
