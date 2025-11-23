<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Department;
use App\Models\Notification;

class RegistrationController extends Controller
{
    public function index(Request $request)
{
    $student = Auth::user();

    // Available courses (not enrolled yet with active enrollment)
    $query = Course::active()
        ->whereDoesntHave('enrollments', function ($q) use ($student) {
            $q->where('student_id', $student->id)
              ->whereIn('status', ['pending', 'approved']); // <-- CHỈ loại trừ enrollments "active"
        });

    // Filters
    if ($request->filled('department_id')) {
        $query->where('department_id', $request->department_id);
    }

    if ($request->filled('type')) {
        $query->where('type', $request->type);
    }

    if ($request->filled('search')) {
        $query->search($request->search);
    }

    $availableCourses = $query->with(['department', 'schedules'])
                              ->paginate(12)
                              ->withQueryString();

    $departments = Department::orderBy('name')->get();

    // My enrollments (load course relation)
    $myEnrollments = Enrollment::forStudent($student->id)
                              ->with(['course.department', 'course.schedules'])
                              ->orderByDesc('created_at')
                              ->get();

    return Inertia::render('Student/Registration/Index', [
        'availableCourses' => $availableCourses,
        'myEnrollments' => $myEnrollments,
        'departments' => $departments,
        'filters' => $request->only(['department_id', 'type', 'search']),
    ]);
}

    public function store(Request $request)
    {
         $student = Auth::user();
        
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('student_id', $student->id)
                             ->where('course_id', $validated['course_id'])
                             ->first();

        if ($existing) {
            return back()->with('error', 'Bạn đã đăng ký học phần này rồi!');
        }

        // Check course capacity
        $course = Course::find($validated['course_id']);
        $currentEnrollments = Enrollment::where('course_id', $course->id)
                                       ->where('status', 'approved')
                                       ->count();

        if ($course->max_students && $currentEnrollments >= $course->max_students) {
            return back()->with('error', 'Học phần đã đầy!');
        }

        // Create enrollment
        Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $validated['course_id'],
            'status' => 'pending',
        ]);

        // Create notification
        Notification::create([
            'user_id' => $student->id,
            'type' => 'enrollment',
            'title' => 'Đăng ký học phần',
            'message' => "Bạn đã đăng ký học phần {$course->name} thành công. Vui lòng chờ phê duyệt.",
        ]);

        return back()->with('success', 'Đăng ký học phần thành công!');
    }

    public function destroy(Enrollment $enrollment)
{
    $student = Auth::user();

    if ($enrollment->student_id !== $student->id) {
        abort(403);
    }

    if (!in_array($enrollment->status, ['pending', 'approved'])) {
        return back()->with('error', 'Không thể hủy đăng ký học phần này!');
    }

    $enrollment->update(['status' => 'dropped']);

    return back()->with('success', 'Đã hủy đăng ký học phần!');
}
}
