<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/inspection-record', function () {
    return Inertia::render('InspectionRecord');
})->name('inspection-record');