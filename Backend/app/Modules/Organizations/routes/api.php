<?php

use App\Modules\Organizations\Controllers\OrganizationController;
use Illuminate\Support\Facades\Route;

Route::get('/organizations', [OrganizationController::class, 'index']);
Route::get('/organizations/discover', [OrganizationController::class, 'discover']);
Route::post('/organizations', [OrganizationController::class, 'store']);
Route::get('/organizations/{organization}', [OrganizationController::class, 'show']);
Route::put('/organizations/{organization}', [OrganizationController::class, 'update']);
Route::post('/organizations/request-membership', [OrganizationController::class, 'requestMembership']);
Route::get('/organizations/{organizationId}/membership-requests', [OrganizationController::class, 'membershipRequests']);
Route::put('/organization-memberships/{membershipId}', [OrganizationController::class, 'updateMembership']);
Route::get('/organizations/{organizationId}/members', [OrganizationController::class, 'members']);
