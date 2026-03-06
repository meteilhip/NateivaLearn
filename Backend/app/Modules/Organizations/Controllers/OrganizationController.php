<?php

namespace App\Modules\Organizations\Controllers;

use App\Http\Controllers\Api\ApiController;
use App\Modules\Organizations\Models\Organization;
use App\Modules\Organizations\Models\OrganizationMembership;
use App\Modules\Organizations\Requests\StoreOrganizationRequest;
use App\Modules\Organizations\Requests\UpdateOrganizationRequest;
use App\Modules\Organizations\Requests\MembershipRequestRequest;
use App\Modules\Organizations\Requests\UpdateMembershipRequest;
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
            ->with('owner:id,name,email')
            ->get();
        return $this->success($organizations);
    }

    public function discover(): JsonResponse
    {
        $city = request()->query('city');
        $query = Organization::query()->with('owner:id,name');
        if ($city) {
            $query->where('city', $city);
        }
        return $this->success($query->get());
    }

    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $org = DB::transaction(function () use ($request) {
            $org = Organization::query()->create([
                'name' => $request->validated('name'),
                'city' => $request->validated('city'),
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
        return $this->success($org->load('owner:id,name,email'), 201);
    }

    public function show(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);
        $organization->load(['owner:id,name,email', 'members.user:id,name,email,role']);
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
        $membership->update(['status' => $request->validated('status')]);
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
