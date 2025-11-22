<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\TuitionFee;
use App\Models\Schedule;
use App\Models\Notification;
use App\Models\Announcement;

class DashboardController extends Controller
{
    public function index()
    {
        $student = Auth::user();

        // Enrollments stats
        $totalCourses = Enrollment::forStudent($student->id)->approved()->count();
        $pendingEnrollments = Enrollment::forStudent($student->id)->pending()->count();
        $pendingEnrollments = Enrollment::forStudent($student->id)->pending()->count();
        
        // GPA calculation
        $enrollments = Enrollment::forStudent($student->id)
                                ->approved()
                                ->whereNotNull('total_score')
                                ->get();
        
        $gpa = $enrollments->avg('total_score') ?? 0;
        $totalCredits = $enrollments->sum('course.credits');

        // Tuition stats
        $unpaidFees = TuitionFee::where('student_id', $student->id)
                                ->where('status', '!=', 'paid')
                                ->sum('remaining_amount');

        // Today's schedule
        $today = now()->format('l'); // Monday, Tuesday, etc.
        $todaySchedule = Schedule::whereHas('course.enrollments', function($q) use ($student) {
                                    $q->where('student_id', $student->id)
                                      ->where('status', 'approved');
                                })
                                ->where('day_of_week', $today)
                                ->with(['course', 'instructor'])
                                ->orderBy('start_time')
                                ->get();

        // Recent notifications
        $notifications = Notification::where('user_id', $student->id)
                                    ->orderByDesc('created_at')
                                    ->take(5)
                                    ->get();

        // Recent announcements
        $announcements = Announcement::published()
                                    ->orderByDesc('is_pinned')
                                    ->orderByDesc('created_at')
                                    ->take(5)
                                    ->get();

        // Upcoming exams (based on schedules)
        $upcomingSchedule = Schedule::whereHas('course.enrollments', function($q) use ($student) {
                                        $q->where('student_id', $student->id)
                                          ->where('status', 'approved');
                                    })
                                    ->with(['course', 'instructor'])
                                    ->orderBy('day_of_week')
                                    ->orderBy('start_time')
                                    ->get();

        return Inertia::render('Student/Dashboard', [
            'stats' => [
                'totalCourses' => $totalCourses,
                'pendingEnrollments' => $pendingEnrollments,
                'gpa' => round($gpa, 2),
                'totalCredits' => $totalCredits,
                'unpaidFees' => $unpaidFees,
                'unreadNotifications' => Notification::where('user_id', $student->id)->unread()->count(),
            ],
            'todaySchedule' => $todaySchedule,
            'upcomingSchedule' => $upcomingSchedule,
            'notifications' => $notifications,
            'announcements' => $announcements,
        ]);
    }
}
