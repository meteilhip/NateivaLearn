<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(base_path('app/Modules/Auth/routes/api.php'));

Route::middleware('auth:sanctum')->group(function () {
    require base_path('app/Modules/Users/routes/api.php');
    require base_path('app/Modules/Organizations/routes/api.php');
    require base_path('app/Modules/Bookings/routes/api.php');
    require base_path('app/Modules/Availability/routes/api.php');
    require base_path('app/Modules/Quizzes/routes/api.php');
    require base_path('app/Modules/Chat/routes/api.php');
    require base_path('app/Modules/Notifications/routes/api.php');
});
