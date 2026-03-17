<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Users\Models\TutorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    /**
     * Vérifie qu'un email est valide et non utilisé.
     * Utilisé côté frontend au Step 0 du signup pour bloquer tôt si l'utilisateur existe déjà.
     */
    public function checkEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ]);

        return $this->success(['email' => $validated['email']]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'city' => $request->validated('city'),
            'country' => $request->validated('country'),
            'password' => $request->validated('password'),
            'role' => $request->validated('role'),
        ]);

        // Création automatique du profil tuteur quand role = tutor ou center_owner
        if (in_array($user->role, ['tutor', 'center_owner'], true)) {
            TutorProfile::create([
                'user_id' => $user->id,
                'bio' => null,
                'hourly_rate' => null,
                'languages' => $request->input('tutor_languages', []),
                'subjects' => $request->input('tutor_subjects', []),
                'video_url' => $request->input('tutor_video_url'),
                'rating' => 0,
            ]);
        }

        Auth::guard('web')->login($user);

        return $this->success([
            'user' => $this->userResource($user),
            'message' => 'Registered successfully.',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::guard('web')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $request->session()->regenerate();
        $user = $request->user();

        return $this->success([
            'user' => $this->userResource($user),
            'message' => 'Logged in successfully.',
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return $this->success(['message' => 'Logged out.']);
    }

    public function user(): JsonResponse
    {
        $user = request()->user();
        if (! $user) {
            return $this->error('Unauthenticated', 401);
        }
        return $this->success(['user' => $this->userResource($user)]);
    }

    private function userResource(User $user): array
    {
        $user->loadMissing(['activeOrganization', 'tutorProfile']);

        $activeOrg = $user->activeOrganization;
        $tutorProfile = $user->tutorProfile;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'city' => $user->city,
            'country' => $user->country,
            'role' => $user->role,
            'active_organization_id' => $user->active_organization_id,
            'activeOrganization' => $activeOrg ? [
                'id' => $activeOrg->id,
                'name' => $activeOrg->name ?? null,
                'city' => $activeOrg->city ?? null,
                'country' => $activeOrg->country ?? null,
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
        ];
    }
}
