<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Department;
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

        $courses = $query->with('department')
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
        
        return Inertia::render('Admin/Courses/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
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
        ]);

        $course = Course::create($validated);

        return redirect()->route('admin.courses.index')
                        ->with('success', 'Học phần đã được tạo thành công!');
    }

    public function edit(Course $course)
    {
        $departments = Department::orderBy('name')->get();
        
        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course->load('department'),
            'departments' => $departments,
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
        ]);

        $course->update($validated);

        return redirect()->route('admin.courses.index')
                        ->with('success', 'Học phần đã được cập nhật!');
    }

    public function destroy(Course $course)
    {
        // Kiểm tra xem có sinh viên đang học không (nếu có relationship với enrollments)
        // if ($course->enrollments()->exists()) {
        //     return back()->with('error', 'Không thể xóa học phần đang có sinh viên đăng ký!');
        // }

        $course->delete();

        return redirect()->route('admin.courses.index')
                        ->with('success', 'Học phần đã được xóa!');
    }

    // Toggle active status
    public function toggleActive(Course $course)
    {
        $course->update([
            'is_active' => !$course->is_active,
        ]);

        return back()->with('success', 'Đã cập nhật trạng thái học phần!');
    }

    // Duplicate course
    public function duplicate(Course $course)
    {
        $newCourse = $course->replicate();
        $newCourse->code = $course->code . '-COPY';
        $newCourse->name = $course->name . ' (Copy)';
        $newCourse->save();

        return redirect()->route('admin.courses.edit', $newCourse)
                        ->with('success', 'Đã sao chép học phần!');
    }
}
