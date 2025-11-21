<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ?string $roles = null)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // chuyển chuỗi roles "admin|teacher" → mảng
        $rolesArray = $roles
            ? preg_split('/[|,]/', $roles, -1, PREG_SPLIT_NO_EMPTY)
            : [];

        // 1) DÙNG CỘT users.role
        if (!empty($rolesArray) && isset($user->role)) {
            if (in_array($user->role, $rolesArray)) {
                return $next($request);
            }
        }

        // 2) SPATIE PERMISSION (nếu bạn dùng)
        if (method_exists($user, 'hasRole')) {
            foreach ($rolesArray as $r) {
                if ($user->hasRole($r)) {
                    return $next($request);
                }
            }
        }

        // không đúng role → redirect theo vai trò hiện tại
        return $this->redirectToDashboard($user->role ?? null);
    }

    protected function redirectToDashboard($role)
    {
        $map = [
            'admin'     => 'admin.dashboard',
            'teacher'   => 'giangvien.dashboard',
            'giang-vien'=> 'giangvien.dashboard',
            'student'   => 'student.dashboard',
            'sinh-vien' => 'student.dashboard'
        ];

        $route = $map[$role] ?? 'home';

        return redirect()->route($route)->with('error', 'Bạn không có quyền truy cập!');
    }
}
