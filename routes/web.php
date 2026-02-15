<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/inspection-record', function () {
    return Inertia::render('InspectionRecordList');
})->name('inspection-record');

Route::get('/inspection-record/create', function () {
    return Inertia::render('InspectionRecordCreate');
})->name('inspection-record.create');