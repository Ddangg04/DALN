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
    public function index(ClassSession $classSession, Request $request)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $date = $request->input('date', now()->toDateString());

        // Get students
        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                                    $q->where('id', $classSession->course_id);
                                })
                                ->where('status', 'approved')
                                ->with(['student'])
                                ->get();

        // Get attendances for date
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