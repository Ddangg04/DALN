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

    if ($search = $request->input('search')) {
        $query->search($search);
    }
    if ($departmentId = $request->input('department_id')) {
        $query->where('department_id', $departmentId);
    }
    if ($type = $request->input('type')) {
        $query->where('type', $type);
    }
    if ($request->has('is_active')) {
        $query->where('is_active', $request->boolean('is_active'));
    }

    $courses = $query->with([
                'department',
                'classSessions' => function($q) {
                    $q->with(['teacher','schedules']);
                }
            ])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

    $departments = Department::orderBy('name')->get();

    return Inertia::render('Admin/Courses/Index', [
        'courses' => $courses,
        'departments' => $departments,
        'filters' => $request->only(['search','department_id','type','is_active','page','class_session_id']),
    ]);
}

    public function create()
    {
        $departments = Department::orderBy('name')->get();

        // Teachers list (assumes spatie roles). If not using spatie, adapt query.
        $teachers = User::role('teacher')->select('id','name')->get();

        return Inertia::render('Admin/Courses/Create', [
            'departments' => $departments,
            'teachers' => $teachers,
        ]);
}

public function store(Request $request)
    {
        // LOGGING ĐẦY ĐỦ
        Log::info('========================================');
        Log::info('COURSE CREATION STARTED');
        Log::info('Request Data:', $request->all());
        Log::info('========================================');

        try {
            // Validation
            $validated = $request->validate([
                'code' => 'required|string|max:20|unique:courses,code',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'credits' => 'required|integer|min:1|max:10',
                'type' => 'required|in:required,elective',
                'is_active' => 'nullable|boolean',
                'department_id' => 'nullable|exists:departments,id',
                'max_students' => 'nullable|integer|min:1',
                'semester' => 'nullable|string|in:Fall,Spring,Summer',
                'year' => 'nullable|integer|min:2020|max:2100',
                'tuition' => 'nullable|numeric|min:0',
                'class_sessions' => 'nullable|array',
                'class_sessions.*.class_code' => 'nullable|string|max:10',
                'class_sessions.*.teacher_id' => 'nullable|exists:users,id',
                'class_sessions.*.max_students' => 'nullable|integer|min:1',
                'class_sessions.*.schedules' => 'nullable|array',
                'class_sessions.*.schedules.*.day_of_week' => 'nullable|string',
                'class_sessions.*.schedules.*.start_time' => 'nullable|string',
                'class_sessions.*.schedules.*.end_time' => 'nullable|string',
                'class_sessions.*.schedules.*.room' => 'nullable|string|max:50',
            ]);

            Log::info('Validation passed', ['validated_data' => $validated]);

            // KHÔNG DÙNG TRANSACTION - Test trước
            // Tạo course trực tiếp
            $courseData = [
                'code' => strtoupper($validated['code']),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'credits' => $validated['credits'],
                'type' => $validated['type'],
                'is_active' => $validated['is_active'] ?? true,
                'department_id' => $validated['department_id'] ?? null,
                'max_students' => $validated['max_students'] ?? null,
                'semester' => $validated['semester'] ?? null,
                'year' => $validated['year'] ?? now()->year,
                'tuition' => $validated['tuition'] ?? null,
            ];

            Log::info('Creating course with data:', $courseData);

            // TẠO COURSE
            $course = Course::create($courseData);

            if (!$course) {
                Log::error('Course creation returned null!');
                throw new \Exception('Không thể tạo học phần');
            }

            Log::info('✅ Course created successfully!', [
                'course_id' => $course->id,
                'course_code' => $course->code,
            ]);

            // Kiểm tra course có trong DB không
            $checkCourse = Course::find($course->id);
            if (!$checkCourse) {
                Log::error('❌ Course not found in DB after creation!');
                throw new \Exception('Course không tồn tại trong database');
            }

            Log::info('✅ Course verified in database', [
                'id' => $checkCourse->id,
                'code' => $checkCourse->code,
                'name' => $checkCourse->name,
            ]);

            // TẠO CLASS SESSIONS (nếu có)
            if (!empty($validated['class_sessions'])) {
                Log::info('Creating class sessions...', [
                    'count' => count($validated['class_sessions'])
                ]);

                foreach ($validated['class_sessions'] as $index => $cs) {
                    // Bỏ qua nếu không có thông tin
                    if (empty($cs['class_code']) && empty($cs['teacher_id'])) {
                        Log::info("Skipping empty session {$index}");
                        continue;
                    }

                    $sessionData = [
                        'course_id' => $course->id,
                        'teacher_id' => $cs['teacher_id'] ?? null,
                        'class_code' => $cs['class_code'] ?? 'A',
                        'semester' => $course->semester,
                        'year' => $course->year,
                        'max_students' => $cs['max_students'] ?? $course->max_students ?? 30,
                        'enrolled_count' => 0,
                        'status' => 'active',
                    ];

                    Log::info("Creating session {$index}", $sessionData);

                    $session = ClassSession::create($sessionData);

                    Log::info("✅ Session {$index} created", [
                        'session_id' => $session->id,
                        'class_code' => $session->class_code,
                    ]);

                    // TẠO SCHEDULES (nếu có)
                    if (!empty($cs['schedules'])) {
                        Log::info("Creating schedules for session {$session->id}...");

                        foreach ($cs['schedules'] as $schIndex => $sch) {
                            if (empty($sch['day_of_week'])) {
                                continue;
                            }

                            $scheduleData = [
                                'course_id' => $course->id,
                                'class_session_id' => $session->id,
                                'day_of_week' => $sch['day_of_week'],
                                'start_time' => $sch['start_time'] ?? '08:00',
                                'end_time' => $sch['end_time'] ?? '10:00',
                                'room' => $sch['room'] ?? null,
                            ];

                            Log::info("Creating schedule {$schIndex}", $scheduleData);

                            $schedule = Schedule::create($scheduleData);

                            Log::info("✅ Schedule {$schIndex} created", [
                                'schedule_id' => $schedule->id,
                            ]);
                        }
                    }
                }
            } else {
                // Tạo 1 session mặc định
                Log::info('No sessions provided, creating default session');

                $defaultSession = ClassSession::create([
                    'course_id' => $course->id,
                    'teacher_id' => null,
                    'class_code' => 'A',
                    'semester' => $course->semester,
                    'year' => $course->year,
                    'max_students' => $course->max_students ?? 30,
                    'enrolled_count' => 0,
                    'status' => 'active',
                ]);

                Log::info('✅ Default session created', [
                    'session_id' => $defaultSession->id,
                ]);
            }

            Log::info('========================================');
            Log::info('✅ COURSE CREATION COMPLETED SUCCESSFULLY');
            Log::info('Course ID: ' . $course->id);
            Log::info('========================================');

            return redirect()
                ->route('admin.courses.index')
                ->with('success', "✅ Học phần '{$course->name}' (ID: {$course->id}) đã được tạo thành công!");

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ VALIDATION ERROR', [
                'errors' => $e->errors(),
            ]);

            return back()
                ->withInput()
                ->withErrors($e->errors())
                ->with('error', 'Dữ liệu không hợp lệ!');

        } catch (\Exception $e) {
            Log::error('========================================');
            Log::error('❌ COURSE CREATION FAILED');
            Log::error('Error: ' . $e->getMessage());
            Log::error('Line: ' . $e->getLine());
            Log::error('File: ' . $e->getFile());
            Log::error('Trace: ' . $e->getTraceAsString());
            Log::error('========================================');

            return back()
                ->withInput()
                ->with('error', 'Lỗi: ' . $e->getMessage() . ' (Line: ' . $e->getLine() . ')');
        }
    }

    public function edit(Course $course)
    {
        $departments = Department::orderBy('name')->get();
        $teachers = User::role('teacher')->select('id','name')->get();

        // load class sessions and schedules
        $course->load(['classSessions.schedules', 'department']);

        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'departments' => $departments,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Course $course)
    {
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
            'class_sessions.*.class_code' => 'nullable|string',
            'class_sessions.*.teacher_id' => 'nullable|exists:users,id',
            'class_sessions.*.max_students' => 'nullable|integer|min:1',
            'class_sessions.*.status' => 'nullable|string',
            'class_sessions.*.schedules' => 'nullable|array',
            'class_sessions.*.schedules.*.id' => 'nullable|exists:schedules,id',
            'class_sessions.*.schedules.*.day_of_week' => 'required_with:class_sessions.*.schedules|string',
            'class_sessions.*.schedules.*.start_time' => 'required_with:class_sessions.*.schedules|string',
            'class_sessions.*.schedules.*.end_time' => 'required_with:class_sessions.*.schedules|string',
            'class_sessions.*.schedules.*.room' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $course->update([
                'code' => $validated['code'],
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

            if (!empty($validated['class_sessions'])) {
                foreach ($validated['class_sessions'] as $cs) {
                    if (!empty($cs['id'])) {
                        $session = ClassSession::find($cs['id']);
                        if ($session) {
                            $session->update([
                                'class_code' => $cs['class_code'] ?? $session->class_code,
                                'teacher_id' => $cs['teacher_id'] ?? $session->teacher_id,
                                'max_students' => $cs['max_students'] ?? $session->max_students,
                                'status' => $cs['status'] ?? $session->status,
                            ]);
                            $incomingSessionIds[] = $session->id;

                            // replace schedules for simplicity
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
                        $session = ClassSession::create([
                            'course_id' => $course->id,
                            'teacher_id' => $cs['teacher_id'] ?? null,
                            'class_code' => $cs['class_code'] ?? null,
                            'semester' => $course->semester,
                            'year' => $course->year,
                            'max_students' => $cs['max_students'] ?? $course->max_students,
                            'enrolled_count' => 0,
                            'status' => $cs['status'] ?? 'active',
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

            // delete sessions that were removed (only if no enrollments)
            $toDelete = $course->classSessions()->whereNotIn('id', $incomingSessionIds)->get();
            foreach ($toDelete as $delSession) {
                if ($delSession->enrollments()->exists()) {
                    // keep it if students are enrolled
                    continue;
                }
                $delSession->schedules()->delete();
                $delSession->delete();
            }

            DB::commit();
            return redirect()->route('admin.courses.index')->with('success', 'Học phần đã được cập nhật!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error updating course: '.$e->getMessage());
            return back()->withInput()->with('error', 'Lỗi khi cập nhật học phần: '.$e->getMessage());
        }
    }

    public function destroy(Course $course)
    {
        if ($course->enrollments()->exists()) {
            return back()->with('error', 'Không thể xóa học phần đang có sinh viên đăng ký!');
        }

        foreach ($course->classSessions as $session) {
            $session->schedules()->delete();
            $session->delete();
        }

        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'Học phần đã được xóa!');
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

            foreach ($course->classSessions as $session) {
                $newSession = $session->replicate();
                $newSession->course_id = $newCourse->id;
                $newSession->enrolled_count = 0;
                $newSession->push();

                foreach ($session->schedules as $sch) {
                    $newSch = $sch->replicate();
                    $newSch->course_id = $newCourse->id;
                    $newSch->class_session_id = $newSession->id;
                    $newSch->push();
                }
            }

            DB::commit();
            return redirect()->route('admin.courses.edit', $newCourse)->with('success', 'Đã sao chép học phần!');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Lỗi khi sao chép: '.$e->getMessage());
        }
    }
}
