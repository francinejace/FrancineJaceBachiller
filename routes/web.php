<?php

use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\PortfolioContentController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'home'])->name('home');
Route::get('/about', [PortfolioController::class, 'about'])->name('about');
Route::get('/skills', [PortfolioController::class, 'skills'])->name('skills');
Route::get('/experience', [PortfolioController::class, 'experience'])->name('experience');
Route::get('/projects', [PortfolioController::class, 'projects'])->name('projects');
Route::get('/certifications', [PortfolioController::class, 'certifications'])->name('certifications');
Route::get('/awards', [PortfolioController::class, 'awards'])->name('awards');
Route::get('/resume', [PortfolioController::class, 'resume'])->name('resume');
Route::get('/contact', [PortfolioController::class, 'contact'])->name('contact');
Route::post('/contact', [ContactMessageController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function (): void {
        Route::redirect('/', '/dashboard')->name('index');

        Route::get('content/{resource}', [PortfolioContentController::class, 'index'])->name('content.index');
        Route::post('content/{resource}', [PortfolioContentController::class, 'store'])->name('content.store');
        Route::patch('content/{resource}/{id}', [PortfolioContentController::class, 'update'])->name('content.update');
        Route::delete('content/{resource}/{id}', [PortfolioContentController::class, 'destroy'])->name('content.destroy');

        Route::get('messages', [AdminContactMessageController::class, 'index'])->name('messages.index');
        Route::post('messages/{contactMessage}/read', [AdminContactMessageController::class, 'markRead'])->name('messages.read');
        Route::delete('messages/{contactMessage}', [AdminContactMessageController::class, 'destroy'])->name('messages.destroy');
    });
});

require __DIR__.'/settings.php';
