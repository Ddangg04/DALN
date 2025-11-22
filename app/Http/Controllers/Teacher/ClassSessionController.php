<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class ClassSessionController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();

        $query = ClassSession::where('teacher_id', $teacher->id);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by semester
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $classes = $query->with(['course', 'enrollments'])
                        ->orderByDesc('year')
                        ->orderByDesc('created_at')
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Teacher/ClassSession/Index', [
            'classes' => $classes,
            'filters' => $request->only(['status', 'semester']),
        ]);
    }

    public function show(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $classSession->load([
            'course.department',
            'enrollments.student',
            'schedules',
        ]);

        // Get students list
        $students = Enrollment::where('course_id', $classSession->course_id)
                             ->where('status', 'approved')
                             ->with(['student', 'attendances'])
                             ->get();

        return Inertia::render('Teacher/ClassSession/Show', [
            'classSession' => $classSession,
            'students' => $students,
        ]);
    }

    // View student roster
    public function students(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $students = Enrollment::whereHas('course', function($q) use ($classSession) {
                                $q->where('id', $classSession->course_id);
                            })
                            ->where('status', 'approved')
                            ->with(['student', 'grades', 'attendances'])
                            ->get()
                            ->map(function($enrollment) {
                                return [
                                    'id' => $enrollment->id,
                                    'student_id' => $enrollment->student->id,
                                    'name' => $enrollment->student->name,
                                    'email' => $enrollment->student->email,
                                    'attendance_rate' => $enrollment->attendance_rate,
                                    'midterm_score' => $enrollment->midterm_score,
                                    'final_score' => $enrollment->final_score,
                                    'total_score' => $enrollment->total_score,
                                    'grade' => $enrollment->grade,
                                ];
                            });

        return Inertia::render('Teacher/ClassSession/Students', [
            'classSession' => $classSession->load('course'),
            'students' => $students,
        ]);
    }
}
