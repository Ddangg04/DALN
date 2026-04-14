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

// Home / Welcome (Unified for Guest & Authenticated)
Route::get('/', function () {
    // Nếu đã đăng nhập nhưng chưa xác thực email, buộc phải đi xác thực
    if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
        return redirect()->route('verification.notice')->with('status', 'must-verify');
    }

    $campaigns = Campaign::where('status', 'active')->latest()->limit(3)->get();
    $latestStatements = Statement::with('campaign:id,title')->where('type', 'in')->latest()->limit(10)->get();
    
    // Top Donors for Golden Board
    $topDonors = \App\Models\Donation::select('user_id', \Illuminate\Support\Facades\DB::raw('SUM(amount) as total_amount'))
        ->where('status', 'completed')
        ->whereNotNull('user_id')
        ->groupBy('user_id')
        ->orderByDesc('total_amount')
        ->limit(5)
        ->with('user:id,name,avatar')
        ->get()
        ->map(function($item) {
            return [
                'name' => $item->user->name,
                'avatar' => $item->user->avatar,
                'total_amount' => $item->total_amount,
            ];
        });

    return Inertia::render('Welcome', [
        'latestStatements' => $latestStatements,
        'featuredCampaigns' => $campaigns,
        'topDonors' => $topDonors,
    ]);
})->name('home');

// Profile Routes
use App\Http\Controllers\ProfileController;
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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

// Chatbot AI (Bắt buộc xác thực Email)
Route::post('/api/chat', [ChatbotController::class, 'chat'])->middleware(['auth', 'verified'])->name('api.chat');

// Email Verification Routes
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Email Verification (Public but Signed)
Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

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
Route::middleware(['web', 'auth', 'role:admin', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRoles'])->name('users.assign-roles');

    Route::post('/campaigns/{id}/restore', [AdminCampaignController::class, 'restore'])->name('campaigns.restore');
    Route::delete('/campaigns/{id}/force-delete', [AdminCampaignController::class, 'forceDelete'])->name('campaigns.force-delete');
    Route::resource('campaigns', AdminCampaignController::class);

    Route::post('/donations/{id}/restore', [AdminDonationController::class, 'restore'])->name('donations.restore');
    Route::delete('/donations/{id}/force-delete', [AdminDonationController::class, 'forceDelete'])->name('donations.force-delete');
    Route::resource('donations', AdminDonationController::class);

    Route::post('/news/{id}/restore', [AdminNewsController::class, 'restore'])->name('news.restore');
    Route::delete('/news/{id}/force-delete', [AdminNewsController::class, 'forceDelete'])->name('news.force-delete');
    Route::resource('news', AdminNewsController::class);

    // AI API
    Route::post('/api/ai-generate', [\App\Http\Controllers\Admin\AIController::class, 'generate'])->name('api.ai-generate');
});