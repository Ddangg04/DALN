<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Department;
use App\Models\ClassSession;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CoursesController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query();

        // Search
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Filter by department
        if ($departmentId = $request->input('department_id')) {
            $query->where('department_id', $departmentId);
        }

        // Filter by type
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $courses = $query->with(['department', 'classSessions'])
                        ->orderByDesc('created_at')
                        ->paginate(15)
                        ->withQueryString();

        $departments = Department::orderBy('name')->get();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department_id', 'type', 'is_active']),
        ]);
    }

    public function create()
    {
        $departments = Department::orderBy('name')->get();
        $teachers = User::role('teacher')->select('id','name')->orderBy('name')->get();

        return Inertia::render('Admin/Courses/Create', [
            'departments' => $departments,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        // Log request để debug
        Log::info('=== COURSE CREATION START ===', [
            'request_data' => $request->all(),
        ]);

        try {
            // Validation
            $validated = $request->validate([
                'code' => 'required|string|max:20|unique:courses,code',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'credits' => 'required|integer|min:1|max:10',
                'type' => 'required|in:required,elective',
                'is_active' => 'boolean',
                'department_id' => 'nullable|exists:departments,id',
                'max_students' => 'nullable|integer|min:1',
                'semester' => 'nullable|string|in:Fall,Spring,Summer',
                'year' => 'nullable|integer|min:2020|max:2100',
                'tuition' => 'nullable|numeric|min:0',

                // Class sessions
                'class_sessions' => 'nullable|array',
                'class_sessions.*.class_code' => 'nullable|string|max:10',
                'class_sessions.*.teacher_id' => 'nullable|exists:users,id',
                'class_sessions.*.max_students' => 'nullable|integer|min:1',
                
                // Schedules
                'class_sessions.*.schedules' => 'nullable|array',
                'class_sessions.*.schedules.*.day_of_week' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.start_time' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.end_time' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.room' => 'nullable|string|max:50',
            ], [
                'code.required' => 'Mã học phần là bắt buộc',
                'code.unique' => 'Mã học phần đã tồn tại',
                'name.required' => 'Tên học phần là bắt buộc',
                'credits.required' => 'Số tín chỉ là bắt buộc',
            ]);

            DB::beginTransaction();

            // Tạo course
            $course = Course::create([
                'code' => strtoupper($validated['code']),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'credits' => $validated['credits'],
                'type' => $validated['type'],
                'department_id' => $validated['department_id'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'semester' => $validated['semester'] ?? null,
                'year' => $validated['year'] ?? now()->year,
                'is_active' => $validated['is_active'] ?? true,
                'tuition' => $validated['tuition'] ?? null,
            ]);

            Log::info('=== COURSE CREATED ===', ['course' => $course]);

            // Tạo class sessions nếu có
            if (!empty($validated['class_sessions'])) {
                foreach ($validated['class_sessions'] as $index => $cs) {
                    // Bỏ qua session nếu không có thông tin quan trọng
                    if (empty($cs['class_code']) && empty($cs['teacher_id'])) {
                        continue;
                    }

                    $session = ClassSession::create([
                        'course_id' => $course->id,
                        'teacher_id' => $cs['teacher_id'] ?? null,
                        'class_code' => $cs['class_code'] ?? 'A',
                        'semester' => $course->semester,
                        'year' => $course->year,
                        'max_students' => $cs['max_students'] ?? $course->max_students,
                        'enrolled_count' => 0,
                        'status' => 'active',
                    ]);

                    Log::info("=== SESSION {$index} CREATED ===", ['session' => $session]);

                    // Tạo schedules nếu có
                    if (!empty($cs['schedules'])) {
                        foreach ($cs['schedules'] as $sch) {
                            Schedule::create([
                                'course_id' => $course->id,
                                'class_session_id' => $session->id,
                                'day_of_week' => $sch['day_of_week'],
                                'start_time' => $sch['start_time'],
                                'end_time' => $sch['end_time'],
                                'room' => $sch['room'] ?? null,
                            ]);
                        }
                    }
                }
            } else {
                // Tạo session mặc định nếu không có
                ClassSession::create([
                    'course_id' => $course->id,
                    'teacher_id' => null,
                    'class_code' => 'A',
                    'semester' => $course->semester,
                    'year' => $course->year,
                    'max_students' => $course->max_students ?? 30,
                    'enrolled_count' => 0,
                    'status' => 'active',
                ]);
            }

            DB::commit();

            Log::info('=== COURSE CREATION SUCCESS ===', ['course_id' => $course->id]);

            return redirect()
                ->route('admin.courses.index')
                ->with('success', "Học phần '{$course->name}' đã được tạo thành công!");

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('=== VALIDATION ERROR ===', ['errors' => $e->errors()]);
            
            return back()
                ->withInput()
                ->withErrors($e->errors());

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('=== COURSE CREATION ERROR ===', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }

    public function edit(Course $course)
    {
        $departments = Department::orderBy('name')->get();
        $teachers = User::role('teacher')->select('id','name')->orderBy('name')->get();

        $course->load(['classSessions.schedules', 'department']);

        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'departments' => $departments,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        Log::info('=== COURSE UPDATE START ===', [
            'course_id' => $course->id,
            'request_data' => $request->all(),
        ]);

        try {
            $validated = $request->validate([
                'code' => "required|string|max:20|unique:courses,code,{$course->id}",
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'credits' => 'required|integer|min:1|max:10',
                'type' => 'required|in:required,elective',
                'is_active' => 'boolean',
                'department_id' => 'nullable|exists:departments,id',
                'max_students' => 'nullable|integer|min:1',
                'semester' => 'nullable|string|in:Fall,Spring,Summer',
                'year' => 'nullable|integer|min:2020|max:2100',
                'tuition' => 'nullable|numeric|min:0',
                
                'class_sessions' => 'nullable|array',
                'class_sessions.*.id' => 'nullable|exists:class_sessions,id',
                'class_sessions.*.class_code' => 'nullable|string|max:10',
                'class_sessions.*.teacher_id' => 'nullable|exists:users,id',
                'class_sessions.*.max_students' => 'nullable|integer|min:1',
                'class_sessions.*.schedules' => 'nullable|array',
                'class_sessions.*.schedules.*.id' => 'nullable|exists:schedules,id',
                'class_sessions.*.schedules.*.day_of_week' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.start_time' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.end_time' => 'required_with:class_sessions.*.schedules|string',
                'class_sessions.*.schedules.*.room' => 'nullable|string|max:50',
            ]);

            DB::beginTransaction();

            // Update course
            $course->update([
                'code' => strtoupper($validated['code']),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'credits' => $validated['credits'],
                'type' => $validated['type'],
                'department_id' => $validated['department_id'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'semester' => $validated['semester'] ?? null,
                'year' => $validated['year'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'tuition' => $validated['tuition'] ?? null,
            ]);

            $incomingSessionIds = [];

            // Update/Create sessions
            if (!empty($validated['class_sessions'])) {
                foreach ($validated['class_sessions'] as $cs) {
                    if (!empty($cs['id'])) {
                        // Update existing session
                        $session = ClassSession::find($cs['id']);
                        if ($session && $session->course_id == $course->id) {
                            $session->update([
                                'class_code' => $cs['class_code'] ?? $session->class_code,
                                'teacher_id' => $cs['teacher_id'] ?? $session->teacher_id,
                                'max_students' => $cs['max_students'] ?? $session->max_students,
                            ]);
                            $incomingSessionIds[] = $session->id;

                            // Delete old schedules và tạo mới
                            $session->schedules()->delete();
                            
                            if (!empty($cs['schedules'])) {
                                foreach ($cs['schedules'] as $sch) {
                                    Schedule::create([
                                        'course_id' => $course->id,
                                        'class_session_id' => $session->id,
                                        'day_of_week' => $sch['day_of_week'],
                                        'start_time' => $sch['start_time'],
                                        'end_time' => $sch['end_time'],
                                        'room' => $sch['room'] ?? null,
                                    ]);
                                }
                            }
                        }
                    } else {
                        // Create new session
                        if (empty($cs['class_code']) && empty($cs['teacher_id'])) {
                            continue;
                        }

                        $session = ClassSession::create([
                            'course_id' => $course->id,
                            'teacher_id' => $cs['teacher_id'] ?? null,
                            'class_code' => $cs['class_code'] ?? 'A',
                            'semester' => $course->semester,
                            'year' => $course->year,
                            'max_students' => $cs['max_students'] ?? $course->max_students,
                            'enrolled_count' => 0,
                            'status' => 'active',
                        ]);
                        $incomingSessionIds[] = $session->id;

                        if (!empty($cs['schedules'])) {
                            foreach ($cs['schedules'] as $sch) {
                                Schedule::create([
                                    'course_id' => $course->id,
                                    'class_session_id' => $session->id,
                                    'day_of_week' => $sch['day_of_week'],
                                    'start_time' => $sch['start_time'],
                                    'end_time' => $sch['end_time'],
                                    'room' => $sch['room'] ?? null,
                                ]);
                            }
                        }
                    }
                }
            }

            // Xóa sessions không còn trong danh sách (nếu không có enrollments)
            $toDelete = $course->classSessions()->whereNotIn('id', $incomingSessionIds)->get();
            foreach ($toDelete as $delSession) {
                if ($delSession->enrollments()->exists()) {
                    continue; // Giữ lại nếu có sinh viên
                }
                $delSession->schedules()->delete();
                $delSession->delete();
            }

            DB::commit();

            Log::info('=== COURSE UPDATE SUCCESS ===', ['course_id' => $course->id]);

            return redirect()
                ->route('admin.courses.index')
                ->with('success', 'Học phần đã được cập nhật!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('=== COURSE UPDATE ERROR ===', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }

    public function destroy(Course $course)
    {
        if ($course->enrollments()->exists()) {
            return back()->with('error', 'Không thể xóa học phần đang có sinh viên đăng ký!');
        }

        // Xóa sessions và schedules
        foreach ($course->classSessions as $session) {
            $session->schedules()->delete();
            $session->delete();
        }

        $course->delete();

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Học phần đã được xóa!');
    }

    public function toggleActive(Course $course)
    {
        $course->update([
            'is_active' => !$course->is_active,
        ]);

        return back()->with('success', 'Đã cập nhật trạng thái học phần!');
    }

    public function duplicate(Course $course)
    {
        DB::beginTransaction();
        try {
            $newCourse = $course->replicate();
            $newCourse->code = $course->code . '-COPY';
            $newCourse->name = $course->name . ' (Copy)';
            $newCourse->push();

            // Duplicate sessions
            foreach ($course->classSessions as $session) {
                $newSession = $session->replicate();
                $newSession->course_id = $newCourse->id;
                $newSession->enrolled_count = 0;
                $newSession->push();

                // Duplicate schedules
                foreach ($session->schedules as $sch) {
                    $newSch = $sch->replicate();
                    $newSch->course_id = $newCourse->id;
                    $newSch->class_session_id = $newSession->id;
                    $newSch->push();
                }
            }

            DB::commit();
            
            return redirect()
                ->route('admin.courses.edit', $newCourse)
                ->with('success', 'Đã sao chép học phần!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Lỗi: ' . $e->getMessage());
        }
    }
}