<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::paginate(20);
        return Inertia::render('Admin/Departments/Index', compact('departments'));
    }

    public function create()
    {
        return Inertia::render('Admin/Departments/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'=>'required|string|unique:departments,code',
            'name'=>'required|string',
        ]);
        Department::create($data);
        return redirect()->route('admin.departments.index')->with('success','Department created');
    }

    public function edit(Department $department)
    {
        return Inertia::render('Admin/Departments/Edit', compact('department'));
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'code'=>"required|string|unique:departments,code,{$department->id}",
            'name'=>'required|string',
        ]);
        $department->update($data);
        return redirect()->route('admin.departments.index')->with('success','Department updated');
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return redirect()->route('admin.departments.index')->with('success','Department deleted');
    }
}
