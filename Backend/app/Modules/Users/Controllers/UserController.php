<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;

class UserController extends ApiController
{
    public function profile(): JsonResponse
    {
        $user = request()->user()->load(['activeOrganization', 'tutorProfile']);
        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'city' => $user->city,
            'role' => $user->role,
            'active_organization_id' => $user->active_organization_id,
            'activeOrganization' => $user->activeOrganization,
            'tutorProfile' => $user->tutorProfile,
        ]);
    }

    public function updateProfile(FormRequest $request): JsonResponse
    {
        $user = request()->user();
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'city' => ['nullable', 'string', 'max:100'],
            // Champs spécifiques au profil tuteur
            'bio' => ['nullable', 'string'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:255'],
            'subjects' => ['nullable', 'array'],
            'subjects.*' => ['string', 'max:255'],
            'video_url' => ['nullable', 'string', 'max:500'],
        ]);

        // Mise à jour des champs utilisateur "simples"
        $userDataKeys = ['name', 'phone', 'city'];
        $userData = [];
        foreach ($userDataKeys as $key) {
            if (array_key_exists($key, $validated)) {
                $userData[$key] = $validated[$key];
            }
        }
        if (! empty($userData)) {
            $user->update($userData);
        }

        // Mise à jour du profil tuteur relié le cas échéant
        $tutorDataKeys = ['bio', 'hourly_rate', 'languages', 'subjects', 'video_url'];
        $tutorData = [];
        foreach ($tutorDataKeys as $key) {
            if (array_key_exists($key, $validated)) {
                $tutorData[$key] = $validated[$key];
            }
        }

        if (! empty($tutorData) && in_array($user->role, ['tutor', 'center_owner'], true)) {
            $profile = $user->tutorProfile ?: $user->tutorProfile()->create();
            $profile->fill($tutorData);
            $profile->save();
        }

        $fresh = $user->fresh(['activeOrganization', 'tutorProfile']);
        $activeOrg = $fresh->activeOrganization;
        $tutorProfile = $fresh->tutorProfile;

        // On renvoie la même structure que /api/auth/user pour garder le store frontend cohérent
        return $this->success([
            'id' => $fresh->id,
            'name' => $fresh->name,
            'email' => $fresh->email,
            'phone' => $fresh->phone,
            'city' => $fresh->city,
            'role' => $fresh->role,
            'active_organization_id' => $fresh->active_organization_id,
            'activeOrganization' => $activeOrg ? [
                'id' => $activeOrg->id,
                'name' => $activeOrg->name ?? null,
                'city' => $activeOrg->city ?? null,
            ] : null,
            'tutorProfile' => $tutorProfile ? [
                'id' => $tutorProfile->id,
                'bio' => $tutorProfile->bio ?? null,
                'hourly_rate' => $tutorProfile->hourly_rate ?? null,
                'languages' => $tutorProfile->languages ?? null,
                'subjects' => $tutorProfile->subjects ?? null,
                'video_url' => $tutorProfile->video_url ?? null,
                'rating' => $tutorProfile->rating ?? 0,
            ] : null,
        ]);
    }

    public function setActiveOrganization(int $organizationId): JsonResponse
    {
        $user = request()->user();
        $membership = $user->memberships()->where('organization_id', $organizationId)->where('status', 'accepted')->first();
        if (! $membership) {
            return $this->error('Organization not found or access denied', 403);
        }
        $user->update(['active_organization_id' => $organizationId]);
        return $this->success($user->fresh('activeOrganization'));
    }
}
