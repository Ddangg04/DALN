<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
use App\Models\Department;
use App\Models\Announcement;
use App\Models\Report;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // ========== USER STATISTICS BY ROLE ==========
        $adminCount = User::role('admin')->count();
        $studentCount = User::role('student')->count();
        $teacherCount = User::role('teacher')->count();
        $totalUsers = User::count();

        // ========== COURSE STATISTICS ==========
        $totalCourses = Course::count();
        $activeCourses = Course::active()->count();
        $requiredCourses = Course::required()->count();
        $electiveCourses = Course::elective()->count();

        // ========== DEPARTMENT STATISTICS ==========
        $totalDepartments = Department::count();

        // ========== ANNOUNCEMENT STATISTICS ==========
        $totalAnnouncements = Announcement::count();
        $pinnedAnnouncements = Announcement::where('is_pinned', true)->count();

        // ========== REPORT STATISTICS ==========
        $totalReports = Report::count();
        $reportsThisMonth = Report::whereMonth('created_at', now()->month)
                                  ->whereYear('created_at', now()->year)
                                  ->count();

        // ========== MONTHLY GROWTH STATISTICS ==========
        $monthlyStats = [
            'users' => User::whereMonth('created_at', now()->month)->count(),
            'students' => User::role('student')->whereMonth('created_at', now()->month)->count(),
            'teachers' => User::role('teacher')->whereMonth('created_at', now()->month)->count(),
            'courses' => Course::whereMonth('created_at', now()->month)->count(),
            'announcements' => Announcement::whereMonth('created_at', now()->month)->count(),
            'reports' => Report::whereMonth('created_at', now()->month)->count(),
        ];

        // ========== RECENT DATA (LAST 7 DAYS) ==========
        $recentUsers = User::with('roles')
                          ->orderByDesc('created_at')
                          ->take(5)
                          ->get()
                          ->map(function($user) {
                              return [
                                  'id' => $user->id,
                                  'name' => $user->name,
                                  'email' => $user->email,
                                  'role' => $user->roles->first()?->name ?? 'user',
                                  'created_at' => $user->created_at->diffForHumans(),
                                  'avatar' => $user->name[0],
                              ];
                          });

        $recentCourses = Course::with('department')
                              ->orderByDesc('created_at')
                              ->take(5)
                              ->get()
                              ->map(function($course) {
                                  return [
                                      'id' => $course->id,
                                      'code' => $course->code,
                                      'name' => $course->name,
                                      'department' => $course->department?->name,
                                      'credits' => $course->credits,
                                      'type' => $course->type,
                                      'is_active' => $course->is_active,
                                      'created_at' => $course->created_at->diffForHumans(),
                                  ];
                              });

        $recentAnnouncements = Announcement::with('author')
                                          ->orderByDesc('is_pinned')
                                          ->orderByDesc('created_at')
                                          ->take(5)
                                          ->get()
                                          ->map(function($announcement) {
                                              return [
                                                  'id' => $announcement->id,
                                                  'title' => $announcement->title,
                                                  'content' => substr($announcement->content, 0, 100),
                                                  'priority' => $announcement->priority,
                                                  'is_pinned' => $announcement->is_pinned,
                                                  'author' => $announcement->author?->name,
                                                  'created_at' => $announcement->created_at->diffForHumans(),
                                              ];
                                          });

        $recentReports = Report::orderByDesc('created_at')
                              ->take(5)
                              ->get()
                              ->map(function($report) {
                                  return [
                                      'id' => $report->id,
                                      'title' => $report->title,
                                      'type' => $report->type,
                                      'created_at' => $report->created_at->diffForHumans(),
                                  ];
                              });

        // ========== USERS BY ROLE BREAKDOWN ==========
        $usersByRole = [
            'admin' => $adminCount,
            'student' => $studentCount,
            'teacher' => $teacherCount,
            'other' => $totalUsers - ($adminCount + $studentCount + $teacherCount),
        ];

        // ========== COURSES BY DEPARTMENT ==========
        $coursesByDepartment = Department::withCount('courses')
                                        ->orderByDesc('courses_count')
                                        ->take(5)
                                        ->get()
                                        ->map(function($dept) {
                                            return [
                                                'name' => $dept->name,
                                                'count' => $dept->courses_count,
                                            ];
                                        });

        // ========== ACTIVITY LOG (LAST 10 ACTIVITIES) ==========
        $activities = $this->getRecentActivities();

        // ========== SYSTEM HEALTH ==========
        $systemHealth = [
            'storage' => $this->getStorageInfo(),
            'database' => $this->getDatabaseInfo(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                // User stats
                'users' => $totalUsers,
                'admins' => $adminCount,
                'students' => $studentCount,
                'teachers' => $teacherCount,
                
                // Course stats
                'courses' => $totalCourses,
                'activeCourses' => $activeCourses,
                'requiredCourses' => $requiredCourses,
                'electiveCourses' => $electiveCourses,
                
                // Other stats
                'departments' => $totalDepartments,
                'announcements' => $totalAnnouncements,
                'pinnedAnnouncements' => $pinnedAnnouncements,
                'reports' => $totalReports,
                'reportsThisMonth' => $reportsThisMonth,
            ],
            'monthlyStats' => $monthlyStats,
            'usersByRole' => $usersByRole,
            'coursesByDepartment' => $coursesByDepartment,
            'recentUsers' => $recentUsers,
            'recentCourses' => $recentCourses,
            'recentAnnouncements' => $recentAnnouncements,
            'recentReports' => $recentReports,
            'activities' => $activities,
            'systemHealth' => $systemHealth,
        ]);
    }

    /**
     * Get recent activities from all models
     */
    private function getRecentActivities()
    {
        $activities = [];

        // Users activities
        $users = User::with('roles')
                    ->whereBetween('created_at', [now()->subDays(7), now()])
                    ->get();
        foreach($users as $user) {
            $activities[] = [
                'type' => 'user_created',
                'icon' => 'user',
                'color' => 'blue',
                'title' => "Người dùng mới: {$user->name}",
                'description' => "Role: " . ($user->roles->first()?->name ?? 'user'),
                'time' => $user->created_at,
            ];
        }

        // Courses activities
        $courses = Course::whereBetween('created_at', [now()->subDays(7), now()])->get();
        foreach($courses as $course) {
            $activities[] = [
                'type' => 'course_created',
                'icon' => 'book',
                'color' => 'green',
                'title' => "Học phần mới: {$course->name}",
                'description' => "Mã: {$course->code}",
                'time' => $course->created_at,
            ];
        }

        // Announcements activities
        $announcements = Announcement::whereBetween('created_at', [now()->subDays(7), now()])->get();
        foreach($announcements as $announcement) {
            $activities[] = [
                'type' => 'announcement_created',
                'icon' => 'megaphone',
                'color' => 'yellow',
                'title' => "Thông báo: {$announcement->title}",
                'description' => "Mức độ: {$announcement->priority}",
                'time' => $announcement->created_at,
            ];
        }

        // Reports activities
        $reports = Report::whereBetween('created_at', [now()->subDays(7), now()])->get();
        foreach($reports as $report) {
            $activities[] = [
                'type' => 'report_created',
                'icon' => 'document',
                'color' => 'purple',
                'title' => "Báo cáo: {$report->title}",
                'description' => "Loại: {$report->type}",
                'time' => $report->created_at,
            ];
        }

        // Sort by time descending
        usort($activities, function($a, $b) {
            return $b['time'] <=> $a['time'];
        });

        return array_slice($activities, 0, 10);
    }

    /**
     * Get storage information
     */
    private function getStorageInfo()
    {
        $storagePath = storage_path('app');
        $totalSpace = disk_total_space($storagePath);
        $freeSpace = disk_free_space($storagePath);
        $usedSpace = $totalSpace - $freeSpace;
        $usedPercentage = ($usedSpace / $totalSpace) * 100;

        return [
            'total' => $this->formatBytes($totalSpace),
            'used' => $this->formatBytes($usedSpace),
            'free' => $this->formatBytes($freeSpace),
            'percentage' => round($usedPercentage, 2),
        ];
    }

    /**
     * Get database information
     */
    private function getDatabaseInfo()
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $tableCount = count($tables);

            // Get database size
            $dbName = config('database.connections.mysql.database');
            $size = DB::select("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
                FROM information_schema.TABLES 
                WHERE table_schema = ?
            ", [$dbName]);

            return [
                'tables' => $tableCount,
                'size' => ($size[0]->size_mb ?? 0) . ' MB',
            ];
        } catch (\Exception $e) {
            return [
                'tables' => 0,
                'size' => 'N/A',
            ];
        }
    }

    /**
     * Format bytes to human readable
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }

    /**
     * Get chart data for courses by month
     */
    public function getCoursesChartData()
    {
        $data = Course::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }

    /**
     * Get chart data for users by month
     */
    public function getUsersChartData()
    {
        $data = User::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }
}


