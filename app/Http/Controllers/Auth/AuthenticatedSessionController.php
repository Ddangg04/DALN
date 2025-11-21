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
use Illuminate\Support\Facades\Log;

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
        // attempt authentication (LoginRequest::authenticate() from Breeze)
        $request->authenticate();

        // regenerate session
        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::user();

        // Activity logging: cố gắng log nhưng KHÔNG để lỗi break flow login
        try {
            if ($user) {
                // nếu spatie/activitylog có sẵn
                if (class_exists('\Spatie\Activitylog\Facades\Activity')) {
                    \Spatie\Activitylog\Facades\Activity::causedBy($user)->log('User logged in');
                } elseif (function_exists('activity')) {
                    // helper activity() của một số phiên bản spatie
                    activity()
                        ->causedBy($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)
                        ->withProperties(['ip' => request()->ip()])
                        ->log('User logged in');
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Activity logging failed on login: ' . $e->getMessage());
        }

        // redirect theo role (normalize)
        return $this->redirectBasedOnRole($user);
    }

    /**
     * Normalize role from model (supports both user->role column and spatie roles)
     * returns normalized lowercase role string, or null if none.
     */
    protected function resolveUserRole($user): ?string
    {
        if (!$user) {
            return null;
        }

        // 1) ưu tiên cột role trên bảng users (nếu có)
        if (isset($user->role) && $user->role !== null) {
            return mb_strtolower(trim($user->role));
        }

        // 2) nếu dùng spatie/permission: getRoleNames() trả Collection
        try {
            if (method_exists($user, 'getRoleNames')) {
                $names = $user->getRoleNames();
                $first = $names->first();
                return $first ? mb_strtolower(trim($first)) : null;
            }

            // 3) một số model có method roles() trả relation -> lấy tên đầu tiên
            if (method_exists($user, 'roles')) {
                try {
                    $rolesRel = $user->roles()->pluck('name')->first();
                    return $rolesRel ? mb_strtolower(trim($rolesRel)) : null;
                } catch (\Throwable $e) {
                    // ignore, fallback null
                }
            }
        } catch (\Throwable $e) {
            // ignore
            Log::debug('resolveUserRole exception: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Redirect user based on their role
     */
    protected function redirectBasedOnRole($user): RedirectResponse
    {
        if (!$user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Người dùng không tồn tại.',
            ]);
        }

        $role = $this->resolveUserRole($user);

        if (!$role) {
            // nếu ko có role -> logout và báo lỗi
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Tài khoản chưa được gán vai trò. Vui lòng liên hệ quản trị.',
            ]);
        }

        // mapping role -> route name (tùy bạn có thể mở rộng)
        $map = [
            'admin' => 'admin.dashboard',
            'administrator' => 'admin.dashboard',

            'teacher' => 'giangvien.dashboard',
            'giang-vien' => 'giangvien.dashboard',
            'giangvien' => 'giangvien.dashboard',
            'chu-nhiem' => 'giangvien.dashboard',
            'pho-truong-khoa' => 'giangvien.dashboard',
            'truong-khoa' => 'giangvien.dashboard',

            'student' => 'student.dashboard',
            'sinh-vien' => 'student.dashboard',
            'sinhvien' => 'student.dashboard',
            'lop-truong' => 'student.dashboard',
        ];

        $routeName = $map[$role] ?? null;

        if (!$routeName) {
            // nếu role không nằm trong map -> logout & báo lỗi
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Vai trò người dùng không hợp lệ hoặc chưa cấu hình redirect.',
            ]);
        }

        // Nếu user có intended (bị chặn bởi auth middleware trước đó) -> redirect intended
        // Nếu không -> tới dashboard tương ứng
        return redirect()->intended(route($routeName))->with('success', 'Chào mừng ' . $user->name);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        try {
            if ($user) {
                if (class_exists('\Spatie\Activitylog\Facades\Activity')) {
                    \Spatie\Activitylog\Facades\Activity::causedBy($user)->log('User logged out');
                } elseif (function_exists('activity')) {
                    activity()->causedBy($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)->log('User logged out');
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Activity logging failed on logout: ' . $e->getMessage());
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Bạn đã đăng xuất thành công!');
    }
}
