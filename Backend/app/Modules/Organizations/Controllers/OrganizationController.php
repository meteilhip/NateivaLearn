<?php

namespace App\Modules\Organizations\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Organizations\Models\Organization;
use App\Modules\Organizations\Models\OrganizationMembership;
use App\Modules\Organizations\Requests\StoreOrganizationRequest;
use App\Modules\Organizations\Requests\UpdateOrganizationRequest;
use App\Modules\Organizations\Requests\MembershipRequestRequest;
use App\Modules\Organizations\Requests\UpdateMembershipRequest;
use App\Modules\Notifications\Models\Notification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrganizationController extends ApiController
{
    use AuthorizesRequests;
    public function index(): JsonResponse
    {
        $user = request()->user();
        $organizations = Organization::query()
            ->where('owner_id', $user->id)
            ->orWhereHas('members', fn ($q) => $q->where('user_id', $user->id)->where('status', 'accepted'))
            ->with('owner:id,name,email,phone')
            ->get();
        return $this->success($organizations);
    }

    public function discover(): JsonResponse
    {
        $city = request()->query('city');
        $country = request()->query('country');
        $query = Organization::query()->with('owner:id,name,email,phone');
        if ($city !== null && $city !== '' && $city !== 'undefined') {
            $query->where('city', $city);
        }
        if ($country !== null && $country !== '' && $country !== 'undefined') {
            $query->where('country', $country);
        }
        return $this->success($query->get());
    }

    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $org = DB::transaction(function () use ($request) {
            $org = Organization::query()->create([
                'name' => $request->validated('name'),
                'city' => $request->validated('city'),
                'country' => $request->validated('country'),
                'description' => $request->validated('description'),
                'logo' => $request->validated('logo'),
                'required_languages' => $request->validated('required_languages'),
                'subjects' => $request->validated('subjects'),
                'owner_id' => $request->user()->id,
            ]);
            OrganizationMembership::query()->create([
                'user_id' => $request->user()->id,
                'organization_id' => $org->id,
                'role' => 'owner',
                'status' => 'accepted',
            ]);
            $request->user()->update(['active_organization_id' => $org->id]);
            return $org;
        });
        return $this->success($org->load('owner:id,name,email,phone'), 201);
    }

    public function show(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);
        $organization->load(['owner:id,name,email,phone', 'members.user:id,name,email,role']);
        return $this->success($organization);
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): JsonResponse
    {
        $this->authorize('update', $organization);
        $organization->update($request->validated());
        return $this->success($organization->fresh('owner:id,name,email'));
    }

    public function requestMembership(MembershipRequestRequest $request): JsonResponse
    {
        $user = $request->user();
        $existing = OrganizationMembership::query()
            ->where('user_id', $user->id)
            ->where('organization_id', $request->validated('organization_id'))
            ->first();
        if ($existing) {
            if ($existing->status === 'pending') {
                return $this->error('Une demande existe déjà pour ce centre', 422);
            }
            return $this->error('Vous êtes déjà membre de ce centre', 422);
        }
        $membership = OrganizationMembership::query()->create([
            'user_id' => $user->id,
            'organization_id' => $request->validated('organization_id'),
            'role' => $request->validated('role'),
            'status' => 'pending',
        ]);
        $membership->load('organization:id,name,owner_id');
        $org = $membership->organization;
        $roleLabel = $request->validated('role') === 'learner' ? 'apprenant' : 'tuteur';
        if ($org && $org->owner_id) {
            Notification::query()->create([
                'user_id' => $org->owner_id,
                'title' => 'Nouvelle demande d\'adhésion',
                'body' => $user->name . ' souhaite rejoindre « ' . ($org->name ?? 'le centre') . ' » en tant que ' . $roleLabel . '. Acceptez ou refusez dans les demandes du centre.',
            ]);
        }
        return $this->success($membership->load('organization'), 201);
    }

    public function membershipRequests(int $organizationId): JsonResponse
    {
        $org = Organization::query()->findOrFail($organizationId);
        $this->authorize('update', $org);
        $requests = OrganizationMembership::query()
            ->where('organization_id', $organizationId)
            ->where('status', 'pending')
            ->with('user:id,name,email')
            ->get();
        return $this->success($requests);
    }

    public function updateMembership(int $membershipId, UpdateMembershipRequest $request): JsonResponse
    {
        $membership = OrganizationMembership::query()->findOrFail($membershipId);
        $this->authorize('update', $membership->organization);
        $status = $request->validated('status');
        $membership->update(['status' => $status]);
        $membership->load('organization:id,name');
        $orgName = $membership->organization?->name ?? 'le centre';
        if ($status === 'accepted') {
            Notification::query()->create([
                'user_id' => $membership->user_id,
                'title' => 'Demande acceptée',
                'body' => "Votre demande pour rejoindre « {$orgName} » a été acceptée.",
            ]);
        } else {
            Notification::query()->create([
                'user_id' => $membership->user_id,
                'title' => 'Demande refusée',
                'body' => "Votre demande pour rejoindre « {$orgName} » n'a pas été acceptée.",
            ]);
        }
        return $this->success($membership->fresh('user', 'organization'));
    }

    public function members(int $organizationId): JsonResponse
    {
        $org = Organization::query()->findOrFail($organizationId);
        $this->authorize('view', $org);
        $members = OrganizationMembership::query()
            ->where('organization_id', $organizationId)
            ->where('status', 'accepted')
            ->with('user:id,name,email,role')
            ->get();
        return $this->success($members);
    }
}
