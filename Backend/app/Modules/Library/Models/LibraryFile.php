<?php

namespace App\Modules\Library\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryFile extends Model
{
    protected $table = 'library_files';

    protected $fillable = ['user_id', 'folder_id', 'name', 'storage_path', 'category', 'mime_type', 'size'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(LibraryFolder::class, 'folder_id');
    }
}
