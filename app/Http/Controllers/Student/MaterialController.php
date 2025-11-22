<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Material;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user();

        // Get enrolled course IDs
        $enrolledCourseIds = Enrollment::forStudent($student->id)
                                      ->approved()
                                      ->pluck('course_id');

        $query = Material::whereIn('course_id', $enrolledCourseIds)
                        ->with(['course', 'uploader']);

        // Filter by course
        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $materials = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        // Get enrolled courses for filter
        $courses = Enrollment::forStudent($student->id)
                            ->approved()
                            ->with('course')
                            ->get()
                            ->pluck('course');

        return Inertia::render('Student/Material/Index', [
            'materials' => $materials,
            'courses' => $courses,
            'filters' => $request->only(['course_id', 'search']),
        ]);
    }

    public function download(Material $material)
    {
        $student = Auth::user();

        // Check if student is enrolled in the course
        $enrolled = Enrollment::where('student_id', $student->id)
                             ->where('course_id', $material->course_id)
                             ->where('status', 'approved')
                             ->exists();

        if (!$enrolled) {
            abort(403, 'Bạn chưa đăng ký học phần này');
        }

        if (!Storage::exists($material->file_path)) {
            abort(404, 'File không tồn tại');
        }

        return Storage::download($material->file_path, $material->title);
    }
}
