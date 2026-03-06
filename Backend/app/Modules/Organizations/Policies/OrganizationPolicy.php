<?php

namespace App\Modules\Organizations\Policies;

use App\Models\User;
use App\Modules\Organizations\Models\Organization;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id
            || $organization->members()->where('user_id', $user->id)->where('status', 'accepted')->exists();
    }

    public function update(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id;
    }

    public function delete(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id;
    }
}
