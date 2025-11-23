<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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

        // Base query: dùng scope active() nếu Course::active() tồn tại,
        // hoặc fallback về Course::query()
        $query = method_exists(Course::class, 'scopeActive') ? Course::active() : Course::query();

        // Loại trừ các courses mà student đã đăng ký (pending/approved)
        // Dùng qualified column enrollments.status để tránh ambiguous
        $query->whereDoesntHave('enrollments', function ($q) use ($student) {
            $q->where('enrollments.student_id', $student->id)
              ->whereIn('enrollments.status', ['pending', 'approved']);
        });

        // Filters
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            // assuming Course has scopeSearch($query, $term)
            if (method_exists(Course::class, 'scopeSearch')) {
                $query->search($request->search);
            } else {
                // fallback: simple where like on name/code/description
                $term = $request->search;
                $query->where(function ($sub) use ($term) {
                    $sub->where('courses.name', 'like', "%{$term}%")
                        ->orWhere('courses.code', 'like', "%{$term}%")
                        ->orWhere('courses.description', 'like', "%{$term}%");
                });
            }
        }

        // Eager loads and count of active enrollments (pending|approved)
        // NOTE: requires Course model to have `enrollments()` relation.
        $availableCourses = $query
            ->with(['department', 'schedules', 'classSessions.schedules'])
            ->withCount(['enrollments as active_enrollments_count' => function ($q) {
                $q->whereIn('enrollments.status', ['pending', 'approved']);
            }])
            ->orderBy('courses.name')
            ->paginate(12)
            ->withQueryString();

        $departments = Department::orderBy('name')->get();

        // My enrollments
        $myEnrollments = Enrollment::forStudent($student->id)
            ->with([
                'course.department',
                'course.schedules',
                'classSession.schedules',
                'classSession.teacher'
            ])
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

        // Prevent duplicate registration for same course
        $existing = Enrollment::where('student_id', $student->id)
            ->where('course_id', $validated['course_id'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Bạn đã đăng ký học phần này rồi hoặc yêu cầu đang chờ xử lý.');
        }

        $course = Course::find($validated['course_id']);
        if (! $course) {
            return back()->with('error', 'Không tìm thấy học phần.');
        }

        // Select session: prefer provided, else pick an active session if exists
        $session = null;
        if (!empty($validated['class_session_id'])) {
            $session = ClassSession::find($validated['class_session_id']);
        }
        if (!$session) {
            $session = ClassSession::where('course_id', $course->id)
                // if you have status column on class_sessions
                ->when(Schema::hasColumn('class_sessions', 'status'), function ($q) {
                    $q->where('status', 'active');
                })
                ->first();
        }
        

        // Course capacity check (if max_students set)
        if (!empty($course->max_students)) {
            $approvedCount = $course->enrollments()->where('enrollments.status', 'approved')->count();
            if ($approvedCount >= $course->max_students) {
                return back()->with('error', 'Học phần đã đầy!');
            }
        }

        // Session capacity check (if session has max_students)
        if ($session && !empty($session->max_students)) {
            $approvedSessionCount = $session->enrollments()->where('enrollments.status', 'approved')->count();
            if ($approvedSessionCount >= $session->max_students) {
                return back()->with('error', 'Lớp đã đầy!');
            }
        }

        // Create enrollment (default status = pending)
        $enrollment = Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'class_session_id' => $session ? $session->id : null,
            'status' => 'pending',
        ]);

        if ($session) {
            if (method_exists($session, 'updateEnrolledCount')) {
                $session->updateEnrolledCount();
            } elseif (Schema::hasColumn('class_sessions', 'enrolled_count')) {
                $session->update([
                    'enrolled_count' => $session->enrollments()->where('enrollments.status', 'approved')->count()
                ]);
            }
        }
        

        // Create notification for student
        Notification::create([
            'user_id' => $student->id,
            'type' => 'enrollment',
            'title' => 'Đăng ký học phần',
            'message' => "Bạn đã đăng ký học phần {$course->name} thành công. Vui lòng chờ phê duyệt.",
        ]);

        return back()->with('success', 'Đăng ký học phần thành công! Vui lòng chờ phê duyệt.');
    }

    public function destroy(Enrollment $enrollment)
    {
        $student = Auth::user();

        if ($enrollment->student_id !== $student->id) {
            abort(403);
        }

        if (! in_array($enrollment->status, ['pending', 'approved'])) {
            return back()->with('error', 'Không thể hủy đăng ký học phần này!');
        }

        $sessionId = $enrollment->class_session_id;
        $enrollment->delete();

        if ($sessionId) {
            $session = ClassSession::find($sessionId);
            if ($session) {
                if (method_exists($session, 'updateEnrolledCount')) {
                    $session->updateEnrolledCount();
                } elseif (Schema::hasColumn('class_sessions', 'enrolled_count')) {
                    $session->update([
                        'enrolled_count' => $session->enrollments()->where('enrollments.status', 'approved')->count()
                    ]);
                }
            }
        }

        return back()->with('success', 'Đã hủy đăng ký học phần!');
    }
}
