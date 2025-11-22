<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassSession;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
class GradeController extends Controller
{
    public function index(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                                    $q->where('id', $classSession->course_id);
                                })
                                ->where('status', 'approved')
                                ->with(['student', 'grades'])
                                ->get();

        return Inertia::render('Teacher/Grade/Index', [
            'classSession' => $classSession->load('course'),
            'enrollments' => $enrollments,
        ]);
    }

    public function update(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'midterm_score' => 'nullable|numeric|min:0|max:100',
            'final_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $enrollment->update($validated);

        // Calculate total score
        if ($enrollment->midterm_score && $enrollment->final_score) {
            $enrollment->calculateTotalScore();
        }

        // Send notification
        Notification::create([
            'user_id' => $enrollment->student_id,
            'type' => 'grade',
            'title' => 'Điểm mới',
            'message' => "Giảng viên đã cập nhật điểm môn {$enrollment->course->name}",
        ]);

        return back()->with('success', 'Đã cập nhật điểm!');
    }

    public function export(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                                    $q->where('id', $classSession->course_id);
                                })
                                ->where('status', 'approved')
                                ->with('student')
                                ->get();

        // Generate CSV
        $filename = "grades_{$classSession->class_code}_" . now()->format('Ymd') . ".csv";
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($enrollments, $classSession) {
            $file = fopen('php://output', 'w');
            
            // Header
            fputcsv($file, ['STT', 'Mã SV', 'Họ tên', 'Email', 'Điểm GK', 'Điểm CK', 'Tổng điểm', 'Xếp loại']);
            
            // Data
            foreach ($enrollments as $index => $enrollment) {
                fputcsv($file, [
                    $index + 1,
                    $enrollment->student->id,
                    $enrollment->student->name,
                    $enrollment->student->email,
                    $enrollment->midterm_score ?? '',
                    $enrollment->final_score ?? '',
                    $enrollment->total_score ?? '',
                    $enrollment->grade ?? '',
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
