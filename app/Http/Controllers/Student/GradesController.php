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

        // Lấy enrollments của student, chỉ lấy những enrollments có course tồn tại
        $query = Enrollment::forStudent($student->id)
                          ->whereIn('status', ['pending', 'approved'])
                          ->whereHas('course') // đảm bảo course tồn tại -> tránh null
                          ->with(['course.department', 'grades']);

        // Filter by semester (filter trên course)
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

        // Calculate statistics safely (null-safe: nếu course null thì trả 0 / 'Unknown')
        $totalCredits = $enrollments->reduce(function ($carry, $en) {
            $credits = 0;
            if ($en->relationLoaded('course') ? $en->course !== null : isset($en->course)) {
                $credits = (int) ($en->course->credits ?? 0);
            } else {
                // fallback: try to access but guard
                $credits = (int) (($en->course ?? null)?->credits ?? 0);
            }
            return $carry + $credits;
        }, 0);

        $gpa = $enrollments->where('total_score', '>', 0)->avg('total_score') ?? 0;

        // GPA grouped by semester + year (null-safe key)
        $semesterGPA = $enrollments->groupBy(function($item) {
            $sem = $item->course?->semester ?? 'Unknown';
            $yr  = $item->course?->year ?? 'Unknown';
            return "{$sem} {$yr}";
        })->map(function($items) {
            return [
                'gpa' => round($items->avg('total_score'), 2),
                'credits' => $items->reduce(function($carry, $en) {
                    return $carry + (int) (($en->course?->credits) ?? 0);
                }, 0),
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
