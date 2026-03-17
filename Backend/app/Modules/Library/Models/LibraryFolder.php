<?php

namespace App\Modules\Library\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LibraryFolder extends Model
{
    protected $table = 'library_folders';

    protected $fillable = ['user_id', 'parent_id', 'name'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(LibraryFolder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(LibraryFolder::class, 'parent_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(LibraryFile::class, 'folder_id');
    }
}
