<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default with Inertia.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        // Lấy user hiện tại (nếu có)
        $user = $request->user();

        $sharedUser = null;

        if ($user) {
            // Thu thập roles theo nhiều cách: cột role, spatie getRoleNames(), relation roles
            $roles = [];

            // 1) spatie/permission: getRoleNames() -> Collection
            try {
                if (method_exists($user, 'getRoleNames')) {
                    $names = $user->getRoleNames(); // collection hoặc array
                    if ($names) {
                        foreach ($names as $n) {
                            $roles[] = strtolower(trim((string) $n));
                        }
                    }
                }
            } catch (\Throwable $e) {
                // ignore
            }

            // 2) cột role trên table users (nếu bạn lưu role dạng string)
            if (isset($user->role) && is_string($user->role) && $user->role !== '') {
                $colRole = strtolower(trim($user->role));
                // đặt cột role làm ưu tiên (đưa lên đầu)
                array_unshift($roles, $colRole);
                // loại trùng
                $roles = array_values(array_unique($roles));
            }

            // 3) relation roles (nếu có và chưa có data)
            if (empty($roles) && isset($user->roles) && is_iterable($user->roles)) {
                foreach ($user->roles as $r) {
                    $name = $r->name ?? $r;
                    $roles[] = strtolower(trim((string) $name));
                }
            }

            // Chuẩn hóa role chính (string) — lấy phần tử đầu tiên nếu có
            $primaryRole = $roles[0] ?? null;

            // Build object user được chia cho client (bảo mật: không trả password, remember_token, v.v.)
            $sharedUser = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $primaryRole,
                'roles' => $roles,
                // thêm thuộc tính boolean hữu ích
                'is_active' => $user->is_active ?? true,
                // nếu muốn thêm avatar hay thông tin khác, thêm ở đây
                // 'avatar' => $user->avatar_url ?? null,
            ];
        }

        return array_merge(parent::share($request), [
            // share auth user (null nếu chưa đăng nhập)
            'auth' => [
                'user' => $sharedUser,
            ],

            // flash messages (Inertia + front-end)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],

            // Ziggy routes nếu có (tùy optional - sẽ trả [] nếu Ziggy ko install)
            'ziggy' => function () use ($request) {
                try {
                    if (function_exists('route') && class_exists('\Tightenco\Ziggy\Ziggy')) {
                        $ziggyClass = '\Tightenco\Ziggy\Ziggy';
                        $ziggy = new $ziggyClass();
                        return array_merge($ziggy->toArray(), [
                            'location' => $request->url(),
                        ]);
                    }
                } catch (\Throwable $e) {
                    // ignore
                }
                return [];
            },
        ]);
    }
}
