<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    public function index()
    {
        // an toàn: kiểm tra tồn tại bảng trước khi query
        $usersCount = Schema::hasTable('users') ? User::count() : 0;
        $coursesCount = Schema::hasTable('courses') ? Course::count() : 0;
        $departmentsCount = Schema::hasTable('departments') ? Department::count() : 0;

        // cố gắng lấy số students/teachers nếu dùng Spatie (role) hoặc fallback
        $studentsCount = 0;
        $teachersCount = 0;
        if (Schema::hasTable('users')) {
            $user = new User();
            if (method_exists($user, 'role') || method_exists($user, 'hasRole') || method_exists($user, 'getRoleNames')) {
                // nếu dùng spatie: truy vấn theo role nếu helper role() hoặc scope có sẵn
                try {
                    if (method_exists(User::class, 'role')) {
                        $studentsCount = User::role('sinh-vien')->count();
                        $teachersCount = User::role('giang-vien')->count();
                    } else {
                        // fallback: dò theo cột 'role' nếu bạn lưu role dạng string trên users table
                        if (Schema::hasColumn('users', 'role')) {
                            $studentsCount = User::where('role', 'sinh-vien')->count();
                            $teachersCount = User::where('role', 'giang-vien')->count();
                        } else {
                            // fallback generic: usersCount as students if nothing else
                            $studentsCount = $usersCount;
                        }
                    }
                } catch (\Throwable $e) {
                    // phòng hờ: nếu có lỗi khi gọi role scope, fallback
                    $studentsCount = $usersCount;
                }
            } else {
                // không có hệ thống role, fallback
                $studentsCount = $usersCount;
            }
        }

        // recentUsers: lấy 6 user mới nhất nếu có bảng users
        $recentUsers = [];
        if (Schema::hasTable('users')) {
            $recent = User::orderBy('created_at', 'desc')->limit(6)->get(['id','name','email','created_at']);
            // cố gắng thêm role tên nếu Spatie dùng getRoleNames
            $recentUsers = $recent->map(function($u) {
                $roleName = null;
                if (method_exists($u, 'getRoleNames')) {
                    $names = $u->getRoleNames();
                    $roleName = $names->first() ?: null;
                } elseif (isset($u->role)) {
                    $roleName = $u->role;
                }
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $roleName ?? 'user',
                    'created_at' => $u->created_at,
                ];
            })->toArray();
        }

        // build stats object aligned với component front-end
        $stats = [
            'students' => $studentsCount,
            'teachers' => $teachersCount,
            'courses' => $coursesCount,
            'departments' => $departmentsCount,
            'recentUsers' => $recentUsers,
            // legacy: giữ users count nếu cần
            'users' => $usersCount,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
