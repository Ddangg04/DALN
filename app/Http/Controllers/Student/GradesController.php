<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class GradesController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user();

        $query = Enrollment::forStudent($student->id)
                          ->approved()
                          ->with(['course.department', 'grades']);

        // Filter by semester
        if ($request->filled('semester')) {
            $query->whereHas('course', function($q) use ($request) {
                $q->where('semester', $request->semester);
            });
        }

        // Filter by year
        if ($request->filled('year')) {
            $query->whereHas('course', function($q) use ($request) {
                $q->where('year', $request->year);
            });
        }

        $enrollments = $query->orderByDesc('created_at')->get();

        // Calculate statistics
        $totalCredits = $enrollments->sum('course.credits');
        $gpa = $enrollments->where('total_score', '>', 0)->avg('total_score') ?? 0;
        
        // GPA by semester
        $semesterGPA = $enrollments->groupBy(function($item) {
            return $item->course->semester . ' ' . $item->course->year;
        })->map(function($items) {
            return [
                'gpa' => round($items->avg('total_score'), 2),
                'credits' => $items->sum('course.credits'),
            ];
        });

        return Inertia::render('Student/Grades/Index', [
            'enrollments' => $enrollments,
            'stats' => [
                'totalCredits' => $totalCredits,
                'gpa' => round($gpa, 2),
                'totalCourses' => $enrollments->count(),
            ],
            'semesterGPA' => $semesterGPA,
            'filters' => $request->only(['semester', 'year']),
        ]);
    }

    public function show(Enrollment $enrollment)
    {
         $student = Auth::user();

        // Check ownership
        if ($enrollment->student_id !== $student->id) {
            abort(403);
        }

        $enrollment->load(['course.department', 'grades']);

        return Inertia::render('Student/Grades/Show', [
            'enrollment' => $enrollment,
        ]);
    }
}