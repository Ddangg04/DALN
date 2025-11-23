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

        // Hiển thị học phần chưa đăng ký hoặc đã hủy
        $query = Course::active()
            ->whereDoesntHave('enrollments', function ($q) use ($student) {
                $q->where('student_id', $student->id)
                  ->whereIn('status', ['pending', 'approved']); // chỉ loại nếu đang đăng ký
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

        $availableCourses = $query->with(['department', 'schedules'])
                                 ->paginate(12)
                                 ->withQueryString();

        $departments = Department::orderBy('name')->get();

        $myEnrollments = Enrollment::forStudent($student->id)
            ->with(['course.department', 'course.schedules'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Student/Registration/Index', [
            'availableCourses' => $availableCourses,
            'myEnrollments'    => $myEnrollments,
            'departments'      => $departments,
            'filters'          => $request->only(['department_id', 'type', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $student = Auth::user();

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        // Kiểm tra trùng nhưng CHỈ trùng nếu pending/approved
        $existing = Enrollment::where('student_id', $student->id)
            ->where('course_id', $validated['course_id'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Bạn đã đăng ký học phần này rồi!');
        }

        $course = Course::findOrFail($validated['course_id']);

        // Kiểm tra sĩ số (chỉ tính approved)
        $currentEnrollments = Enrollment::where('course_id', $course->id)
            ->where('status', 'approved')
            ->count();

        if ($course->max_students && $currentEnrollments >= $course->max_students) {
            return back()->with('error', 'Học phần đã đầy!');
        }

        Enrollment::create([
            'student_id' => $student->id,
            'course_id'  => $validated['course_id'],
            'status'     => 'pending',
        ]);

        Notification::create([
            'user_id' => $student->id,
            'type'    => 'enrollment',
            'title'   => 'Đăng ký học phần',
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

        // XÓA hoàn toàn → trở về trạng thái như chưa đăng ký
        $enrollment->delete();

        return back()->with('success', 'Đã hủy đăng ký học phần!');
    }
}
