<?php

namespace App\Modules\Library\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryShare extends Model
{
    protected $table = 'library_shares';

    protected $fillable = ['sender_id', 'recipient_id', 'shareable_type', 'shareable_id'];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    }
