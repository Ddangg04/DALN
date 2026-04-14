<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\TransparencyController;
use App\Http\Controllers\NewsController;

// Auth controllers
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Admin controllers
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Admin\DonationController as AdminDonationController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;

use Illuminate\Support\Facades\Auth;
use App\Models\Campaign;
use App\Models\Statement;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home / Welcome
Route::get('/', function () {
    $campaigns = Campaign::where('status', 'active')->latest()->limit(3)->get();
    $latestStatements = Statement::with('campaign:id,title')->where('type', 'in')->latest()->limit(10)->get();

    if (Auth::check()) {
        $user = Auth::user();
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }
        // Fetch user donation stats
        $donations = $user->donations()->with('campaign:id,title')->latest()->limit(5)->get();
        $totalDonated = $user->donations()->where('status', 'completed')->sum('amount');
        $campaignsSupported = $user->donations()->where('status', 'completed')->distinct('campaign_id')->count('campaign_id');

        return Inertia::render('Dashboard', [
            'recentDonations' => $donations,
            'totalDonated' => $totalDonated,
            'campaignsSupported' => $campaignsSupported,
            'latestStatements' => $latestStatements,
            'featuredCampaigns' => $campaigns,
        ]);
    }
    return Inertia::render('Welcome', [
        'auth' => ['user' => null],
        'latestStatements' => $latestStatements,
        'featuredCampaigns' => $campaigns,
    ]);
})->name('home');

// Auth Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);

Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// OAuth Google
Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Chatbot AI
Route::post('/api/chat', [ChatbotController::class, 'chat'])->name('api.chat');

// Email Verification Routes
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Public Campaign Routes
Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show'])->name('campaigns.show');
Route::post('/campaigns/{campaign}/donate', [CampaignController::class, 'donate'])->middleware(['auth', 'verified'])->name('campaigns.donate');

// Transparency Routes
Route::get('/transparency', [TransparencyController::class, 'index'])->name('transparency.index');

// News Routes
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{news:slug}', [NewsController::class, 'show'])->name('news.show');

// Admin routes
Route::middleware(['web', 'auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRoles'])->name('users.assign-roles');

    Route::resource('campaigns', AdminCampaignController::class);
    Route::resource('donations', AdminDonationController::class);
    Route::resource('news', AdminNewsController::class);

    // AI API
    Route::post('/api/ai-generate', [\App\Http\Controllers\Admin\AIController::class, 'generate'])->name('api.ai-generate');
});