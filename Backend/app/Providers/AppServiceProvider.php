<?php

namespace App\Providers;

use App\Models\User;
use App\Modules\Organizations\Models\Organization;
use App\Modules\Organizations\Policies\OrganizationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Organization::class, OrganizationPolicy::class);
    }
}
