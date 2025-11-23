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
use App\Models\ClassSession;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user();

        $query = Course::active()
            ->whereDoesntHave('enrollments', function ($q) use ($student) {
                $q->where('student_id', $student->id)
                  ->whereIn('status', ['pending', 'approved']);
            });

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $availableCourses = $query->with(['department', 'schedules', 'classSessions' => function($q){
            $q->withCount(['enrollments as active_enrollments_count' => function($q2){
                $q2->whereIn('status', ['pending','approved']);
            }]);
        }])->paginate(12)->withQueryString();

        $departments = Department::orderBy('name')->get();

        $myEnrollments = Enrollment::forStudent($student->id)
                                  ->with(['course.department', 'course.schedules', 'classSession.schedules','classSession.teacher'])
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
            'class_session_id' => 'nullable|exists:class_sessions,id',
        ]);

        // only check pending/approved
        $existing = Enrollment::where('student_id', $student->id)
            ->where('course_id', $validated['course_id'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Bạn đã đăng ký học phần này rồi!');
        }

        $course = Course::findOrFail($validated['course_id']);

        // capacity check by counting approved
        $currentEnrollments = Enrollment::where('course_id', $course->id)
            ->where('status', 'approved')
            ->count();

        if ($course->max_students && $currentEnrollments >= $course->max_students) {
            return back()->with('error', 'Học phần đã đầy!');
        }

        $sessionId = $validated['class_session_id'] ?? null;

        // validate provided session exists and belongs to course
        if ($sessionId) {
            $session = ClassSession::where('id', $sessionId)
                        ->where('course_id', $course->id)
                        ->first();
            if (!$session) $sessionId = null;
        }

        // auto assign if none provided: find first session with capacity
        if (!$sessionId) {
            $session = $course->classSessions()->get()->first(function($s){
                $count = $s->enrollments()->whereIn('status', ['pending','approved'])->count();
                return !$s->max_students || $count < $s->max_students;
            });
            $sessionId = $session->id ?? null;
        }

        Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'class_session_id' => $sessionId,
            'status' => 'pending',
        ]);

        // update enrolled_count for session if assigned
        if ($sessionId) {
            $session = ClassSession::find($sessionId);
            if ($session) $session->updateEnrolledCount();
        }

        Notification::create([
            'user_id' => $student->id,
            'type' => 'enrollment',
            'title' => 'Đăng ký học phần',
            'message' => "Bạn đã đăng ký học phần {$course->name} thành công. Vui lòng chờ phê duyệt.",
            'content' => "Bạn đã đăng ký học phần {$course->name} thành công.",
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

        $sessionId = $enrollment->class_session_id;
        $enrollment->delete();

        if ($sessionId) {
            $session = ClassSession::find($sessionId);
            if ($session) $session->updateEnrolledCount();
        }

        return back()->with('success', 'Đã hủy đăng ký học phần!');
    }
}
