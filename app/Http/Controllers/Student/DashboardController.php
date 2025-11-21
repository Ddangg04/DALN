<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Tải dữ liệu an toàn (try/catch tránh lỗi khi bảng chưa có)
        try {
            $stats = [
                'current_courses' => 3,
                'gpa' => 3.45,
                'total_credits' => 60,
                'outstanding_tuition' => 0,
            ];

            // Lấy 5 thông báo mới nếu bảng tồn tại
            if (Schema::hasTable('announcements')) {
                $announcements = DB::table('announcements')
                    ->select('id','title','created_at')
                    ->orderBy('created_at','desc')
                    ->limit(5)
                    ->get()
                    ->map(fn($a) => (array)$a)
                    ->toArray();
            }

            // Lịch học sample (thay bằng query thực tế nếu có)
            $schedule = [
                ['course_name' => 'Lập trình web', 'teacher_name' => 'TS. A', 'start_time' => '08:00', 'end_time' => '09:45', 'room' => 'P101', 'session_type' => 'LT'],
                ['course_name' => 'Cơ sở dữ liệu', 'teacher_name' => 'ThS. B', 'start_time' => '10:00', 'end_time' => '11:45', 'room' => 'P202', 'session_type' => 'TH'],
            ];

            $upcomingExams = [
                ['course_name' => 'Cơ sở dữ liệu', 'exam_date' => now()->addDays(7)->toDateString(), 'room' => 'Hội trường A'],
            ];

            $recentGrades = []; // nếu có table grades, load ở đây

        } catch (\Throwable $e) {
            $stats = [];
            $announcements = [];
            $schedule = [];
            $upcomingExams = [];
            $recentGrades = [];
        }

        return Inertia::render('Student/Dashboard', [
            'stats' => $stats,
            'schedule' => $schedule,
            'announcements' => $announcements,
            'upcomingExams' => $upcomingExams,
            'recentGrades' => $recentGrades,
        ]);
    }
}
