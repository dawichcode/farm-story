<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\ServiceRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/ping', fn () => response()->json(['success' => true, 'data' => 'pong', 'message' => null]));

// Farmers
Route::post('/farmers',          [FarmerController::class, 'store']);
Route::get('/farmers',           [FarmerController::class, 'index']);
Route::get('/farmers/{farmer}',  [FarmerController::class, 'show']);

// Farms
Route::get('/farms',         [FarmController::class, 'index']);
Route::post('/farms',        [FarmController::class, 'store']);
Route::get('/farms/{farm}',  [FarmController::class, 'show']);

// Intelligence
Route::get('/farms/{farm}/insight', [InsightController::class, 'show']);

// Service Requests
Route::post('/service-requests', [ServiceRequestController::class, 'store']);
Route::get('/service-requests',  [ServiceRequestController::class, 'index']);

// Admin
Route::prefix('admin')->group(function (): void {
    Route::get('/dashboard',           [AdminController::class, 'dashboard']);
    Route::get('/farmers',             [AdminController::class, 'farmers']);
    Route::get('/farmers/export',      [AdminController::class, 'exportCsv']);   // must be before {farmer}
    Route::get('/farmers/{farmer}',    [AdminController::class, 'farmerDetail']);
    Route::get('/requests',            [AdminController::class, 'requests']);
});
