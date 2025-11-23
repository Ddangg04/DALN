<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassSession;
use App\Models\Attendance;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Hiển thị danh sách lớp để chọn điểm danh
     */
    public function classList(Request $request)
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

        $classes = $query->with(['course.department'])
                        ->whereIn('status', ['open', 'in_progress']) // Chỉ hiển thị lớp đang active
                        ->orderByDesc('year')
                        ->orderByDesc('created_at')
                        ->paginate(12)
                        ->withQueryString();

        return Inertia::render('Teacher/Attendance/ClassList', [
            'classes' => $classes,
            'filters' => $request->only(['status', 'semester']),
        ]);
    }

    /**
     * Trang điểm danh cho 1 lớp cụ thể
     */
    public function index(ClassSession $classSession, Request $request)
    {
        $teacher = Auth::user();

        // Check ownership
        if ($classSession->teacher_id !== $teacher->id) {
            abort(403, 'Bạn không có quyền truy cập lớp này');
        }

        $date = $request->input('date', now()->toDateString());

        // Get students enrolled in this course
        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                                    $q->where('id', $classSession->course_id);
                                })
                                ->where('status', 'approved')
                                ->with(['student'])
                                ->get();

        // Get attendances for this date
        $attendances = Attendance::where('class_session_id', $classSession->id)
                                ->where('date', $date)
                                ->get()
                                ->keyBy('enrollment_id');

        $students = $enrollments->map(function($enrollment) use ($attendances) {
            $attendance = $attendances->get($enrollment->id);
            return [
                'enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student->id,
                'name' => $enrollment->student->name,
                'email' => $enrollment->student->email,
                'attendance' => $attendance ? [
                    'id' => $attendance->id,
                    'status' => $attendance->status,
                    'note' => $attendance->note,
                ] : null,
            ];
        });

        return Inertia::render('Teacher/Attendance/Index', [
            'classSession' => $classSession->load('course'),
            'students' => $students,
            'date' => $date,
        ]);
    }

    public function store(Request $request, ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.enrollment_id' => 'required|exists:enrollments,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.note' => 'nullable|string',
        ]);

        foreach ($validated['attendances'] as $item) {
            Attendance::updateOrCreate(
                [
                    'enrollment_id' => $item['enrollment_id'],
                    'class_session_id' => $classSession->id,
                    'date' => $validated['date'],
                ],
                [
                    'status' => $item['status'],
                    'note' => $item['note'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Điểm danh thành công!');
    }
}
