<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Classroom; // or your model name

class ClassController extends Controller
{
    public function index()
    {
        $classes = Classroom::with('students')->where('teacher_id', Auth::id())->paginate(20);
        return Inertia::render('GiangVien/Classes/Index', compact('classes'));
    }

    public function show($id)
    {
        $class = Classroom::with('students')->findOrFail($id);
        return Inertia::render('GiangVien/Classes/Show', compact('class'));
    }

    // nếu cần create/edit cho giảng viên (thường giảng viên không tạo lớp)
}
