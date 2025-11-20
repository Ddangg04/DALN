<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth controllers
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Admin controllers
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CoursesController as AdminCoursesController;
use App\Http\Controllers\Admin\DepartmentController as AdminDepartmentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

// Giảng viên controllers (nếu có)
use App\Http\Controllers\GiangVien\DashboardController as GVDashboardController;

// Sinh viên controllers (nếu có)
use App\Http\Controllers\SinhVien\DashboardController as SVDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home (Inertia welcome)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Default dashboard (authenticated & verified)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes (middleware auth)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Auth routes (Breeze/Fortify style)
require __DIR__.'/auth.php';

// OAuth: Google
Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

/*
|--------------------------------------------------------------------------
| Admin routes (prefix: admin, middleware: auth + role:admin)
|--------------------------------------------------------------------------
| Assumes you have a 'role' middleware (e.g. spatie or custom) and role name 'admin'
*/
Route::middleware(['web', 'auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users (CRUD + extra actions)
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Reset password -> generate temp password & send email
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');

    // Assign roles to user
    Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRoles'])->name('users.assign-roles');

    // Courses (Admin/Pages: resources/js/Pages/Admin/Courses)
    Route::get('/courses', [AdminCoursesController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [AdminCoursesController::class, 'create'])->name('courses.create');
    Route::post('/courses', [AdminCoursesController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [AdminCoursesController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [AdminCoursesController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [AdminCoursesController::class, 'destroy'])->name('courses.destroy');

    // Departments
    Route::resource('departments', AdminDepartmentController::class)->except(['show'])->names('departments');
});

/*
|--------------------------------------------------------------------------
| Giảng viên routes (prefix: giang-vien)
|--------------------------------------------------------------------------
| Thay 'giang-vien' bằng tên role middleware bạn đang dùng nếu khác
*/
Route::middleware(['auth', 'role:giang-vien|chu-nhiem|pho-truong-khoa|truong-khoa'])->prefix('giang-vien')->name('giangvien.')->group(function () {
    Route::get('/dashboard', [GVDashboardController::class, 'index'])->name('dashboard');

    // Thêm route cho: lớp, điểm, điểm danh, tài liệu, thông báo...
    // Ví dụ (skeleton):
    // Route::get('classes', [GVClassController::class, 'index'])->name('classes.index');
});

/*
|--------------------------------------------------------------------------
| Sinh viên routes (prefix: sinh-vien)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:sinh-vien|lop-truong'])->prefix('sinh-vien')->name('sinhvien.')->group(function () {
    Route::get('/dashboard', [SVDashboardController::class, 'index'])->name('dashboard');

    // Thêm route cho: đăng ký học phần, bảng điểm, lịch học, tài liệu...
    // Route::get('courses', [EnrollmentController::class, 'available'])->name('courses.available');
});

/*
|--------------------------------------------------------------------------
| API / AJAX helper routes (optional)
|--------------------------------------------------------------------------
| Nếu cần route AJAX nội bộ (kiểm tra trùng lịch, lấy môn theo khoa...)
*/
Route::middleware('auth')->prefix('api')->name('api.')->group(function () {
    // Route::get('courses/by-department/{dept}', [App\Http\Controllers\Api\CourseApiController::class, 'byDepartment'])->name('courses.by-department');
});

/*
|--------------------------------------------------------------------------
| Fallback
|--------------------------------------------------------------------------
*/
Route::fallback(function () {
    // Nếu dùng SPA + Inertia, redirect về home hoặc render 404 page
    return redirect()->route('home');
});
