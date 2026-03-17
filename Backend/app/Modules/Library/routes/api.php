<?php

use App\Modules\Library\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;

Route::get('/library', [LibraryController::class, 'index']);
Route::post('/library/folders', [LibraryController::class, 'storeFolder']);
Route::post('/library/files', [LibraryController::class, 'storeFile']);
Route::post('/library/share', [LibraryController::class, 'share']);
Route::get('/library/files/{id}/download', [LibraryController::class, 'download'])->name('api.library.download');
Route::delete('/library/files/{id}', [LibraryController::class, 'destroyFile']);
Route::delete('/library/folders/{id}', [LibraryController::class, 'destroyFolder']);
