<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassSession;
use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\Auth;
class DashboardController extends Controller
{
    public function index()
    {
        $teacher = Auth::user();

        // Stats
        $totalClasses = ClassSession::where('teacher_id', $teacher->id)->count();
        $activeClasses = ClassSession::where('teacher_id', $teacher->id)
                                    ->where('status', 'in_progress')
                                    ->count();
        $totalStudents = Enrollment::whereHas('course.classSessions', function($q) use ($teacher) {
                                $q->where('teacher_id', $teacher->id);
                            })
                            ->where('status', 'approved')
                            ->count();
        $pendingAssignments = Assignment::where('teacher_id', $teacher->id)
                                       ->whereHas('submissions', function($q) {
                                           $q->where('status', 'submitted');
                                       })
                                       ->count();

        // Today's classes
        $today = now()->format('l');
        $todaySchedule = TeachingSchedule::where('teacher_id', $teacher->id)
                                        ->where('day_of_week', $today)
                                        ->with(['course', 'classSession'])
                                        ->orderBy('start_time')
                                        ->get();

        // Recent classes
        $recentClasses = ClassSession::where('teacher_id', $teacher->id)
                                    ->with(['course', 'enrollments'])
                                    ->orderByDesc('created_at')
                                    ->take(5)
                                    ->get();

        // Pending grading
        $pendingGrading = Assignment::where('teacher_id', $teacher->id)
                                   ->with(['submissions' => function($q) {
                                       $q->where('status', 'submitted');
                                   }])
                                   ->take(5)
                                   ->get();

        return Inertia::render('Teacher/Dashboard', [
            'stats' => [
                'totalClasses' => $totalClasses,
                'activeClasses' => $activeClasses,
                'totalStudents' => $totalStudents,
                'pendingAssignments' => $pendingAssignments,
            ],
            'todaySchedule' => $todaySchedule,
            'recentClasses' => $recentClasses,
            'pendingGrading' => $pendingGrading,
        ]);
    }
}

