<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\AssignmentSubmission;
use Illuminate\Support\Facades\Storage;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $teacher = Auth::user();

        $query = Assignment::where('teacher_id', $teacher->id);

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $assignments = $query->with(['course', 'submissions'])
                            ->orderByDesc('created_at')
                            ->paginate(10)
                            ->withQueryString();

        $courses = Course::whereHas('classSessions', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->get();

        return Inertia::render('Teacher/Assignment/Index', [
            'assignments' => $assignments,
            'courses' => $courses,
            'filters' => $request->only(['course_id']),
        ]);
    }

    public function create()
    {
        $teacher = Auth::user();

        $courses = Course::whereHas('classSessions', function($q) use ($teacher) {
                        $q->where('teacher_id', $teacher->id);
                    })->get();

        return Inertia::render('Teacher/Assignment/Create', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date|after:now',
            'max_score' => 'required|integer|min:1|max:100',
            'file' => 'nullable|file|max:10240', // 10MB
        ]);

        $validated['teacher_id'] = Auth::id();
        $validated['status'] = 'published';

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('assignments', 'public');
        }

        Assignment::create($validated);

        return redirect()->route('teacher.assignments.index')
                        ->with('success', 'Đã tạo bài tập!');
    }

    public function show(Assignment $assignment)
    {
        $teacher = Auth::user();

        if ($assignment->teacher_id !== $teacher->id) {
            abort(403);
        }

        $assignment->load([
            'course',
            'submissions.student',
        ]);

        return Inertia::render('Teacher/Assignment/Show', [
            'assignment' => $assignment,
        ]);
    }

    public function gradeSubmission(Request $request, AssignmentSubmission $submission)
    {
        $validated = $request->validate([
            'score' => 'required|numeric|min:0|max:' . $submission->assignment->max_score,
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'score' => $validated['score'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
        ]);

        // Notification
        Notification::create([
            'user_id' => $submission->student_id,
            'type' => 'assignment',
            'title' => 'Bài tập đã được chấm',
            'message' => "Bài tập '{$submission->assignment->title}' đã được chấm điểm",
        ]);

        return back()->with('success', 'Đã chấm bài!');
    }
}
