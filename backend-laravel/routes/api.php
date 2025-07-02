<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WaitlistController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\SettingsController;

Route::prefix('v1')->group(function () {
    // Waitlist
    Route::post('/waitlist/email-capture', [WaitlistController::class, 'captureEmail']);
    Route::put('/waitlist/{id}', [WaitlistController::class, 'update']);
    Route::get('/waitlist', [WaitlistController::class, 'index']);
    Route::get('/waitlist/{id}', [WaitlistController::class, 'show']);
    Route::delete('/waitlist/{id}', [WaitlistController::class, 'destroy']);
    Route::post('/waitlist/bulk-delete', [WaitlistController::class, 'bulkDelete']);

    // Admin
    Route::post('/auth/login', [AdminController::class, 'login']);
    Route::post('/admin/content', [ContentController::class, 'store']);
    Route::get('/admin/settings', [SettingsController::class, 'index']);
    Route::put('/admin/settings', [SettingsController::class, 'update']);
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/export', [AdminController::class, 'export']);
    Route::post('/admin/upload-logo', [SettingsController::class, 'uploadLogo']);

    // Public Content & Settings
    Route::get('/content', [ContentController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);

    // AI Agent
    Route::post('/ai/security', [\App\Http\Controllers\Api\AIAgentController::class, 'security']);
});