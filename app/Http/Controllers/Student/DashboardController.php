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

        // GPA calculation
        $enrollments = Enrollment::forStudent($student->id)
                                ->approved()
                                ->whereNotNull('total_score')
                                ->get();

        $gpa = $enrollments->avg('total_score') ?? 0;

        // Tính tổng tín chỉ an toàn: lấy từ relation classSession->course nếu có
        $totalCredits = $enrollments->reduce(function ($carry, $enrollment) {
            $credits = 0;
            try {
                $classSession = $enrollment->classSession;
                if ($classSession && $classSession->course && isset($classSession->course->credits)) {
                    $credits = (int) $classSession->course->credits;
                }
            } catch (\Throwable $e) {
                // ignore and keep credits = 0
            }
            return $carry + $credits;
        }, 0);

        // Tuition stats
        $unpaidFees = TuitionFee::where('student_id', $student->id)
                                ->where('status', '!=', 'paid')
                                ->sum('remaining_amount');

        // Today's schedule
        $today = now()->format('l'); // Monday, Tuesday, etc.

        // NOTE: Use qualified column names inside whereHas to avoid ambiguous 'status'
        $todaySchedule = Schedule::whereHas('classSession', function ($q) use ($student) {
                                    $q->whereHas('enrollments', function ($qe) use ($student) {
                                        $qe->where('enrollments.student_id', $student->id)
                                           ->where('enrollments.status', 'approved');
                                    });
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

        // Upcoming exams / schedules (based on enrollments)
        $upcomingSchedule = Schedule::whereHas('classSession', function ($q) use ($student) {
                                        $q->whereHas('enrollments', function ($qe) use ($student) {
                                            $qe->where('enrollments.student_id', $student->id)
                                               ->where('enrollments.status', 'approved');
                                        });
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
