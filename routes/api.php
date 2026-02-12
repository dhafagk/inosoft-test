<?php

use App\Http\Controllers\Api\InspectionController;
use Illuminate\Support\Facades\Route;

Route::prefix('inspection')->group(function () {
    Route::get('/', [InspectionController::class, 'index']);
    Route::post('/', [InspectionController::class, 'store']);
    Route::get('/yards', [InspectionController::class, 'yards']);
    Route::get('/customers', [InspectionController::class, 'customers']);
    Route::get('/tpi-companies', [InspectionController::class, 'tpiCompanies']);
    Route::get('/items', [InspectionController::class, 'items']);
    Route::get('/{no}', [InspectionController::class, 'show']);
});
