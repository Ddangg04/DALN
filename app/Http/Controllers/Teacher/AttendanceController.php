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
    public function classList(Request $request)
    {
        $teacher = Auth::user();

        $query = ClassSession::where('teacher_id', $teacher->id);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $classes = $query->with(['course.department'])
            ->orderByDesc('year')
            ->orderByDesc('created_at')
            ->paginate(12);

        return Inertia::render('Teacher/Attendance/ClassList', [
            'classes' => $classes,
            'filters' => $request->only(['status', 'semester']),
        ]);
    }

    public function index(ClassSession $classSession, Request $request)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403, 'Bạn không có quyền truy cập lớp này');
        }

        $date = $request->input('date', now()->toDateString());

        // ⭐ Lấy đúng sinh viên thuộc lớp học phần
        $enrollments = Enrollment::where('class_session_id', $classSession->id)
            ->where('status', 'approved')
            ->with('student')
            ->get();

        // ⭐ Load dữ liệu điểm danh
        $attendances = Attendance::where('class_session_id', $classSession->id)
            ->where('date', $date)
            ->get()
            ->keyBy('enrollment_id');

        // ⭐ Trả về dữ liệu đầy đủ cho FE
        $students = $enrollments->map(function ($enrollment) use ($attendances) {
            $att = $attendances->get($enrollment->id);

            return [
                'enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student->id,
                'name' => $enrollment->student->name,
                'email' => $enrollment->student->email,
                'attendance' => $att ? [
                    'id' => $att->id,
                    'status' => $att->status,
                    'note' => $att->note,
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
                    'class_session_id' => $classSession->id,
                    'enrollment_id' => $item['enrollment_id'],
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
