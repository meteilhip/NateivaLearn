<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Organizations\Controllers\OrganizationController;

Route::prefix('auth')->group(base_path('app/Modules/Auth/routes/api.php'));

// Découverte des centres : public pour que la liste s'affiche (learner/center, tutor/center)
Route::get('/organizations/discover', [OrganizationController::class, 'discover']);

Route::middleware('auth:sanctum')->group(function () {
    require base_path('app/Modules/Users/routes/api.php');
    require base_path('app/Modules/Organizations/routes/api.php');
    require base_path('app/Modules/Bookings/routes/api.php');
    require base_path('app/Modules/Availability/routes/api.php');
    require base_path('app/Modules/Quizzes/routes/api.php');
    require base_path('app/Modules/Chat/routes/api.php');
    require base_path('app/Modules/Notifications/routes/api.php');
    require base_path('app/Modules/Library/routes/api.php');
});
