<?php

namespace App\Modules\Organizations\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'city',
        'country',
        'description',
        'owner_id',
        'logo',
        'required_languages',
        'subjects',
    ];

    protected $casts = [
        'required_languages' => 'array',
        'subjects' => 'array',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(OrganizationMembership::class);
    }
}
