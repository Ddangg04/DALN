<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Department;
use Inertia\Inertia;

class CoursesController extends Controller
{
    public function index()
    {
        $courses = Course::with('department')->paginate(15);
        return Inertia::render('Admin/Courses/Index', compact('courses'));
    }

    public function create()
    {
        $departments = Department::all();
        return Inertia::render('Admin/Courses/Create', compact('departments'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:courses,code',
            'name' => 'required|string',
            'department_id' => 'nullable|exists:departments,id'
        ]);
        Course::create($data);
        return redirect()->route('admin.courses.index')->with('success','Course created');
    }

    public function edit(Course $course)
    {
        $departments = Department::all();
        return Inertia::render('Admin/Courses/Edit', compact('course','departments'));
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'code' => "required|string|unique:courses,code,{$course->id}",
            'name' => 'required|string',
            'department_id' => 'nullable|exists:departments,id'
        ]);
        $course->update($data);
        return redirect()->route('admin.courses.index')->with('success','Course updated');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses.index')->with('success','Course deleted');
    }
}
