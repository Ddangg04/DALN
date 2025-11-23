<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassSession;
use App\Models\Grade;
use App\Models\Enrollment;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
class GradeController extends Controller
{
    /**
     * Danh sách lớp để chấm điểm
     */
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
                        ->withCount('enrollments')
                        ->orderByDesc('year')
                        ->orderByDesc('created_at')
                        ->paginate(12)
                        ->withQueryString();

        // Thêm thông tin grades cho mỗi lớp
        $classes->getCollection()->transform(function ($class) {
            $gradesStats = Grade::where('class_session_id', $class->id)
                ->selectRaw('
                    COUNT(*) as total_graded,
                    COUNT(CASE WHEN status = "completed" THEN 1 END) as completed,
                    COUNT(CASE WHEN status = "locked" THEN 1 END) as locked,
                    AVG(total_score) as average_score
                ')
                ->first();

            $class->grades_stats = $gradesStats;
            return $class;
        });

        return Inertia::render('Teacher/Grades/ClassList', [
            'classes' => $classes,
            'filters' => $request->only(['status', 'semester']),
        ]);
    }

    /**
     * Quản lý điểm của 1 lớp
     */
    public function index(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403, 'Bạn không có quyền truy cập lớp này');
        }

        // Get enrollments với grades
        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                            $q->where('id', $classSession->course_id);
                        })
                        ->where('status', 'approved')
                        ->with(['student'])
                        ->get();

        // Get existing grades
        $grades = Grade::where('class_session_id', $classSession->id)
                    ->get()
                    ->keyBy('enrollment_id');

        // Combine data
        $students = $enrollments->map(function($enrollment) use ($grades, $classSession) {
            $grade = $grades->get($enrollment->id);
            
            return [
                'enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student->id,
                'student_code' => $enrollment->student->student_code ?? '—',
                'name' => $enrollment->student->name,
                'email' => $enrollment->student->email,
                'grade' => $grade ? [
                    'id' => $grade->id,
                    'attendance_score' => $grade->attendance_score,
                    'midterm_score' => $grade->midterm_score,
                    'final_score' => $grade->final_score,
                    'bonus_score' => $grade->bonus_score,
                    'total_score' => $grade->total_score,
                    'letter_grade' => $grade->letter_grade,
                    'status' => $grade->status,
                    'note' => $grade->note,
                ] : null,
            ];
        });

        // Statistics
        $stats = $this->calculateStatistics($classSession);

        return Inertia::render('Teacher/Grades/Index', [
            'classSession' => $classSession->load('course'),
            'students' => $students,
            'statistics' => $stats,
            'canEdit' => $grades->where('status', '!=', 'locked')->count() > 0,
        ]);
    }

    /**
     * Lưu/Cập nhật điểm
     */
    public function store(Request $request, ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $validated = $request->validate([
            'grades' => 'required|array',
            'grades.*.enrollment_id' => 'required|exists:enrollments,id',
            'grades.*.attendance_score' => 'nullable|numeric|min:0|max:10',
            'grades.*.midterm_score' => 'nullable|numeric|min:0|max:10',
            'grades.*.final_score' => 'nullable|numeric|min:0|max:10',
            'grades.*.bonus_score' => 'nullable|numeric|min:0|max:2',
            'grades.*.note' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['grades'] as $item) {
                $grade = Grade::updateOrCreate(
                    [
                        'enrollment_id' => $item['enrollment_id'],
                        'class_session_id' => $classSession->id,
                    ],
                    [
                        'attendance_score' => $item['attendance_score'] ?? null,
                        'midterm_score' => $item['midterm_score'] ?? null,
                        'final_score' => $item['final_score'] ?? null,
                        'bonus_score' => $item['bonus_score'] ?? 0,
                        'note' => $item['note'] ?? null,
                        'graded_by' => $teacher->id,
                        'graded_at' => now(),
                        'status' => 'completed',
                    ]
                );
            }

            DB::commit();
            return back()->with('success', 'Cập nhật điểm thành công!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    /**
     * Tính điểm chuyên cần tự động từ attendance
     */
    public function calculateAttendance(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        $enrollments = Enrollment::whereHas('course', function($q) use ($classSession) {
                            $q->where('id', $classSession->course_id);
                        })
                        ->where('status', 'approved')
                        ->get();

        DB::beginTransaction();
        try {
            foreach ($enrollments as $enrollment) {
                // Đếm số buổi học
                $totalClasses = Attendance::where('class_session_id', $classSession->id)
                                ->where('enrollment_id', $enrollment->id)
                                ->count();

                if ($totalClasses === 0) continue;

                // Đếm số buổi có mặt
                $present = Attendance::where('class_session_id', $classSession->id)
                            ->where('enrollment_id', $enrollment->id)
                            ->where('status', 'present')
                            ->count();

                // Tính điểm chuyên cần (tỷ lệ % * 10)
                $attendanceScore = ($present / $totalClasses) * 10;

                // Cập nhật vào bảng grades
                Grade::updateOrCreate(
                    [
                        'enrollment_id' => $enrollment->id,
                        'class_session_id' => $classSession->id,
                    ],
                    [
                        'attendance_score' => round($attendanceScore, 2),
                        'graded_by' => $teacher->id,
                    ]
                );
            }

            DB::commit();
            return back()->with('success', 'Tính điểm chuyên cần tự động thành công!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Lock grades (không cho sửa nữa)
     */
    public function lock(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        Grade::where('class_session_id', $classSession->id)
            ->update(['status' => 'locked']);

        return back()->with('success', 'Đã khóa điểm lớp học này');
    }

    /**
     * Unlock grades
     */
    public function unlock(ClassSession $classSession)
    {
        $teacher = Auth::user();

        if ($classSession->teacher_id !== $teacher->id) {
            abort(403);
        }

        Grade::where('class_session_id', $classSession->id)
            ->where('status', 'locked')
            ->update(['status' => 'completed']);

        return back()->with('success', 'Đã mở khóa điểm');
    }

    /**
     * Export điểm ra Excel
     */
    public function export(ClassSession $classSession)
    {
        // Implement CSV/Excel export
        // Using Laravel Excel or manual CSV generation
    }

    /**
     * Thống kê điểm
     */
    private function calculateStatistics(ClassSession $classSession)
    {
        $grades = Grade::where('class_session_id', $classSession->id)
                    ->whereNotNull('total_score')
                    ->get();

        if ($grades->isEmpty()) {
            return null;
        }

        $scores = $grades->pluck('total_score');

        return [
            'total_students' => $grades->count(),
            'average' => round($scores->avg(), 2),
            'highest' => $scores->max(),
            'lowest' => $scores->min(),
            'pass_rate' => round(($grades->where('total_score', '>=', 5.0)->count() / $grades->count()) * 100, 1),
            'grade_distribution' => [
                'A' => $grades->whereIn('letter_grade', ['A+', 'A'])->count(),
                'B' => $grades->whereIn('letter_grade', ['B+', 'B'])->count(),
                'C' => $grades->whereIn('letter_grade', ['C+', 'C'])->count(),
                'D' => $grades->whereIn('letter_grade', ['D+', 'D'])->count(),
                'F' => $grades->where('letter_grade', 'F')->count(),
            ],
        ];
    }
}