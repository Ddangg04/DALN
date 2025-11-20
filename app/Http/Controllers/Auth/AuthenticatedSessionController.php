<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Facades\Activity;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::user();
        // Log login activity
        Activity::log('User logged in');

        // Redirect based on user role
        return $this->redirectBasedOnRole($user);
    }

    /**
     * Redirect user based on their role
     */
    protected function redirectBasedOnRole($user): RedirectResponse
    {
        // Check if user account is active
        if (isset($user->is_active) && !$user->is_active) {
            Auth::logout();
            return redirect()->route('login')
                ->withErrors([
                    'email' => 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.',
                ]);
        }

        // Redirect based on role
        switch ($user->role) {
            case 'admin':
                return redirect()->intended(route('admin.dashboard'))
                    ->with('success', 'Chào mừng quản trị viên ' . $user->name);

            case 'teacher':
                return redirect()->intended(route('teacher.dashboard'))
                    ->with('success', 'Chào mừng giảng viên ' . $user->name);

            case 'student':
                return redirect()->intended(route('student.dashboard'))
                    ->with('success', 'Chào mừng sinh viên ' . $user->name);

            default:
                Auth::logout();
                return redirect()->route('login')
                    ->withErrors([
                        'email' => 'Vai trò người dùng không hợp lệ.',
                    ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Log logout activity
        // Log logout activity
        Activity::log('User logged out');
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/')
            ->with('success', 'Bạn đã đăng xuất thành công!');
    }
}