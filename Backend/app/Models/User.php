<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'country',
        'password',
        'role',
        'active_organization_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function setEmailAttribute(?string $value): void
    {
        $this->attributes['email'] = $value ? Str::of($value)->trim()->lower()->toString() : null;
    }

    public function activeOrganization()
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class, 'active_organization_id');
    }

    public function organizationsOwned()
    {
        return $this->hasMany(\App\Modules\Organizations\Models\Organization::class, 'owner_id');
    }

    public function memberships()
    {
        return $this->hasMany(\App\Modules\Organizations\Models\OrganizationMembership::class);
    }

    public function tutorProfile()
    {
        return $this->hasOne(\App\Modules\Users\Models\TutorProfile::class);
    }

    public function bookingsAsLearner()
    {
        return $this->hasMany(\App\Modules\Bookings\Models\Booking::class, 'learner_id');
    }

    public function bookingsAsTutor()
    {
        return $this->hasMany(\App\Modules\Bookings\Models\Booking::class, 'tutor_id');
    }
}
