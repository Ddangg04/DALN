<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * $roles có thể là null hoặc chuỗi dạng "admin" hoặc "admin|teacher" hoặc "admin,teacher"
     */
    public function handle(Request $request, Closure $next, ?string $roles = null)
    {
        $user = Auth::user();

        // Nếu chưa đăng nhập -> chuyển tới login
        if (!$user) {
            return redirect()->route('login');
        }

        // Nếu không truyền roles vào middleware thì cho qua (hoặc bạn có thể đổi logic để chặn)
        if (empty($roles)) {
            return $next($request);
        }

        // Chuyển chuỗi roles thành mảng (hỗ trợ '|' hoặc ',')
        $rolesArray = preg_split('/[|,]/', $roles, -1, PREG_SPLIT_NO_EMPTY);
        $rolesArray = array_map('trim', $rolesArray);

        // Nếu user có bất kỳ role nào trong rolesArray => cho tiếp
        foreach ($rolesArray as $role) {
            // Nếu dùng Spatie: hasRole exists; nếu không, thay logic phù hợp (ví dụ $user->role === $role)
            if (method_exists($user, 'hasRole') && is_callable([$user, 'hasRole'])) {
                /** @var \Spatie\Permission\Traits\HasRoles $user */
                if ($user->hasRole($role)) {
                    return $next($request);
                }
            } else {
                // fallback: kiểm tra trường role trên user (tùy bạn đặt tên cột)
                if (isset($user->role) && $user->role === $role) {
                    return $next($request);
                }
            }
        }

        // Không có quyền -> xác định role hiện tại của user (nếu có) để redirect tới dashboard phù hợp
        $currentRole = null;
        if (method_exists($user, 'getRoleNames') && is_callable([$user, 'getRoleNames'])) {
            // getRoleNames() trả collection (Spatie)
            /** @var \Spatie\Permission\Traits\HasRoles $user */
            $names = $user->getRoleNames();
            $currentRole = $names->first() ?: null;
        } elseif (isset($user->role)) {
            $currentRole = $user->role;
        }

        return $this->redirectToUserDashboard($currentRole);
    }

    /**
     * Redirect user to their appropriate dashboard
     * Accepts null $role safely.
     */
    protected function redirectToUserDashboard(?string $role): RedirectResponse
    {
        $routes = [
            'admin' => 'admin.dashboard',
            'teacher' => 'teacher.dashboard',
            'giang-vien' => 'giangvien.dashboard',
            'chu-nhiem' => 'giangvien.dashboard',
            'pho-truong-khoa' => 'giangvien.dashboard',
            'truong-khoa' => 'giangvien.dashboard',
            'student' => 'student.dashboard',
            'sinh-vien' => 'sinhvien.dashboard',
            'lop-truong' => 'sinhvien.dashboard',
        ];

        // nếu không xác định role hoặc không có route tương ứng -> fallback về 'home'
        $route = $routes[$role] ?? 'home';

        return redirect()->route($route)
            ->with('error', 'Bạn không có quyền truy cập trang này.');
    }
}
