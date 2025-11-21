<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
use App\Models\Department;

class DashboardController extends Controller
{
    public function index()
    {
        $usersCount = User::count();
        $coursesCount = Course::count();
        $departmentsCount = Department::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $usersCount,
                'courses' => $coursesCount,
                'departments' => $departmentsCount,
            ]
        ]);
    }
}
