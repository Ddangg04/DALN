<?php
namespace App\Http\Controllers\SinhVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function show($courseId)
    {
        $records = Attendance::where('course_id', $courseId)
            ->where('student_id', Auth::id())
            ->get();
        return Inertia::render('SinhVien/Attendance/Show', compact('records'));
    }
}
