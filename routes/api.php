<?php

use App\Http\Controllers\Api\PortfolioApiController;
use App\Http\Controllers\ContactMessageController;
use Illuminate\Support\Facades\Route;

Route::get('portfolio', [PortfolioApiController::class, 'overview']);
Route::get('projects', [PortfolioApiController::class, 'projects']);
Route::get('projects/featured', [PortfolioApiController::class, 'featuredProjects']);
Route::get('skills', [PortfolioApiController::class, 'skills']);
Route::get('experiences', [PortfolioApiController::class, 'experiences']);
Route::get('leaderships', [PortfolioApiController::class, 'leaderships']);
Route::get('awards', [PortfolioApiController::class, 'awards']);
Route::get('certifications', [PortfolioApiController::class, 'certifications']);
Route::get('social-links', [PortfolioApiController::class, 'socialLinks']);
Route::get('gallery', [PortfolioApiController::class, 'gallery']);
Route::get('settings', [PortfolioApiController::class, 'settings']);

Route::post('contact-messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:10,1');
