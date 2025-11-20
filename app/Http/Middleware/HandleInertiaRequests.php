<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
// ...

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        // các share sẵn có khác nếu có...
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                // trả về danh sách roles (id + name) — dùng relation roles()
                'roles' => $request->user()->roles->map(function($r) {
                    return ['id' => $r->id, 'name' => $r->name];
                })->values(),
                // nếu muốn trả về role names đơn giản: getRoleNames()
                // 'role_names' => $request->user()->getRoleNames(), 
            ] : null,
        ],

        // ví dụ: truyền flash message (nếu chưa có)
        'flash' => [
            'success' => fn() => $request->session()->get('success'),
            'error' => fn() => $request->session()->get('error'),
        ],
    ]);
}

}
