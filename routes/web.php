<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth controllers
use App\Http\Controllers\Auth\GoogleController;

// Admin controllers
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CoursesController as AdminCoursesController;
use App\Http\Controllers\Admin\DepartmentController as AdminDepartmentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;

// Giảng viên / Sinh viên controllers (nếu có)
use App\Http\Controllers\GiangVien\DashboardController as GVDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/
use Illuminate\Support\Facades\Auth;

/*
|-----------------------------------------------------------------------
| Public homepage (Welcome / Login)
|-----------------------------------------------------------------------
|
| Nếu chưa đăng nhập => hiển thị Inertia 'Welcome' (trong project của
| bạn file: resources/js/Pages/Welcome.jsx)
| Nếu đã đăng nhập => redirect theo role (admin / giang-vien / sinh-vien)
|
*/

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        $role = strtolower(trim($user->role ?? ''));

        // mapping role -> route name (chỉnh nếu route name của bạn khác)
        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'administrator' => redirect()->route('admin.dashboard'),
            'teacher', 'giang-vien', 'giangvien', 'chu-nhiem', 'pho-truong-khoa' => redirect()->route('teacher.dashboard'),
            'student', 'sinh-vien', 'sinhvien', 'lop-truong' => redirect()->route('student.dashboard'),
            default => redirect()->route('login'),
        };
    }

    // Nếu chưa đăng nhập -> hiện trang Welcome (đồng thời Welcome chứa form POST tới route('login'))
    return Inertia::render('Welcome');
})->name('home');

/*
|-----------------------------------------------------------------------
| Authentication routes (nếu bạn không dùng Breeze auto-generated)
|-----------------------------------------------------------------------
|
| Thêm các route login/register/password nếu project chưa có.
| Nếu bạn đã require __DIR__.'/auth.php' thì có thể không cần.
|
*/

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Login (show + submit)
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Register (show + submit) — nếu có đăng ký public
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);

// Password reset (request form + send link)
Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
// reset token -> new password
Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');

// Logout (POST)
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// OAuth Google (nếu dùng)
Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Admin routes (prefix: admin, middleware: auth + role:admin)

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

    // reset password & assign roles
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('/users/{user}/roles', [AdminUserController::class, 'assignRoles'])->name('users.assign-roles');

    // Courses
    Route::get('/courses', [AdminCoursesController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [AdminCoursesController::class, 'create'])->name('courses.create');
    Route::post('/courses', [AdminCoursesController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [AdminCoursesController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [AdminCoursesController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [AdminCoursesController::class, 'destroy'])->name('courses.destroy');

    // Departments (resource except show)
    Route::resource('departments', AdminDepartmentController::class)->except(['show'])->names('departments');

    // Announcements (create & store)
   Route::get('/announcements', [AdminAnnouncementController::class, 'index'])
    ->name('announcements.index');

Route::get('/announcements/create', [AdminAnnouncementController::class, 'create'])
    ->name('announcements.create');

Route::post('/announcements', [AdminAnnouncementController::class, 'store'])
    ->name('announcements.store');

Route::get('/announcements/{announcement}', [AdminAnnouncementController::class, 'show'])
    ->name('announcements.show');

Route::get('/announcements/{announcement}/edit', [AdminAnnouncementController::class, 'edit'])
    ->name('announcements.edit');

Route::put('/announcements/{announcement}', [AdminAnnouncementController::class, 'update'])
    ->name('announcements.update');

Route::delete('/announcements/{announcement}', [AdminAnnouncementController::class, 'destroy'])
    ->name('announcements.destroy');
    // Reports
      Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
Route::get('/reports/create', [AdminReportController::class, 'create'])->name('reports.create');
Route::post('/reports', [AdminReportController::class, 'store'])->name('reports.store');
Route::get('/reports/{report}', [AdminReportController::class, 'show'])->name('reports.show');
Route::get('/reports/{report}/download', [AdminReportController::class, 'download'])->name('reports.download');
Route::get('/reports/{report}/export', [AdminReportController::class, 'export'])->name('reports.export');
Route::get('/reports/edit', [AdminReportController::class, 'edit'])->name('reports.edit');
Route::put('/reports/{report}', [AdminReportController::class, 'update'])->name('reports.update');
Route::delete('/reports/{report}', [AdminReportController::class, 'destroy'])->name('reports.destroy');

});

use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\ClassSessionController;
use App\Http\Controllers\Teacher\AttendanceController as TeacherAttendanceController;
use App\Http\Controllers\Teacher\GradeController;
use App\Http\Controllers\Teacher\AssignmentController;
use App\Http\Controllers\Teacher\ScheduleController as TeacherScheduleController;

// Teacher Routes
Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
    
    // Class Sessions (Quản lý Lớp học phần)
    Route::get('/classes', [ClassSessionController::class, 'index'])->name('classes.index');
    Route::get('/classes/{classSession}', [ClassSessionController::class, 'show'])->name('classes.show');
    Route::get('/classes/students', [ClassSessionController::class, 'students'])->name('classes.students');
    
    // Attendance (Điểm danh)
    Route::get('/attendance', [TeacherAttendanceController::class, 'classList'])->name('attendance.list'); // Danh sách lớp
    Route::get('/attendance/{classSession}', [TeacherAttendanceController::class, 'index'])->name('attendance.index'); // Điểm danh
    Route::post('/attendance/{classSession}', [TeacherAttendanceController::class, 'store'])->name('attendance.store');
    // Grades (Quản lý Điểm số)
   Route::prefix('grades')->name('grades.')->group(function () {
        // Danh sách lớp để chấm điểm
        Route::get('/', [GradeController::class, 'classList'])->name('list');
        
        // Quản lý điểm của 1 lớp
        Route::get('/{classSession}', [GradeController::class, 'index'])->name('index');
        Route::post('/{classSession}', [GradeController::class, 'store'])->name('store');
        Route::put('/{grade}', [GradeController::class, 'update'])->name('update');
        
        // Tính điểm chuyên cần tự động
        Route::post('/{classSession}/calculate-attendance', [GradeController::class, 'calculateAttendance'])
            ->name('calculate-attendance');
        
        // Lock/Unlock grades
        Route::post('/{classSession}/lock', [GradeController::class, 'lock'])->name('lock');
        Route::post('/{classSession}/unlock', [GradeController::class, 'unlock'])->name('unlock');
        
        // Export
        Route::get('/{classSession}/export', [GradeController::class, 'export'])->name('export');
        
        // Statistics
        Route::get('/{classSession}/statistics', [GradeController::class, 'statistics'])->name('statistics');
    });
    // Assignments (Bài tập)
    Route::resource('assignments', AssignmentController::class);
    Route::post('/submissions/{submission}/grade', [AssignmentController::class, 'gradeSubmission'])->name('submissions.grade');
    
    // Schedule (Lịch giảng dạy)
    Route::get('/schedule', [TeacherScheduleController::class, 'index'])->name('schedule.index');
});
    // Thêm route cho giảng viên ở đây...
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\ScheduleController;
use App\Http\Controllers\Student\GradesController;
use App\Http\Controllers\Student\RegistrationController;
use App\Http\Controllers\Student\TuitionController;
use App\Http\Controllers\Student\MaterialController;
use App\Http\Controllers\Student\ProfileController ;
use App\Http\Controllers\Student\NotificationController;
use App\Http\Controllers\Student\RequestController;
use App\Models\Course;

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    
    // Registration (Đăng ký học phần)
    Route::get('/registration', [RegistrationController::class, 'index'])->name('registration.index');
    Route::post('/registration', [RegistrationController::class, 'store'])->name('registration.store');
    Route::delete('/registration/{enrollment}', [RegistrationController::class, 'destroy'])->name('registration.destroy');
    
    // Grades (Xem điểm)
    Route::get('/grades', [GradesController::class, 'index'])->name('grades.index');
    Route::get('/grades/{enrollment}', [GradesController::class, 'show'])->name('grades.show');
    
    // Schedule (Lịch học)
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    
    // Tuition (Học phí)
    Route::get('/tuition', [TuitionController::class, 'index'])->name('tuition.index');
    Route::get('/tuition/{tuitionFee}', [TuitionController::class, 'show'])->name('tuition.show');
    
    // Materials (Tài liệu)
    Route::get('/materials', [MaterialController::class, 'index'])->name('materials.index');
    Route::get('/materials/{material}/download', [MaterialController::class, 'download'])->name('materials.download');
    
    // Notifications (Thông báo)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
});
Route::get('/debug-course-sessions/{course}', function (Course $course) {
    $sessions = $course->classSessions()
        ->with(['teacher', 'schedules'])
        ->get();

    return response()->json([
        'course_id' => $course->id,
        'course_name' => $course->name,
        'sessions_count' => $sessions->count(),
        'sessions' => $sessions->toArray(),
        'is_array' => is_array($sessions->toArray()),
    ]);
});