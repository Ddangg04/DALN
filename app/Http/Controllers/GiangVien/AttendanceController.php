<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Course;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index($courseId)
    {
        $course = Course::with('attendances.student')->findOrFail($courseId);
        return Inertia::render('GiangVien/Attendance/Index', compact('course'));
    }

    public function mark(Request $request, $courseId)
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'array'
        ]);

        // Example: attendances => [student_id => present boolean]
        foreach($request->attendances as $studentId => $present){
            Attendance::updateOrCreate(
                ['course_id'=>$courseId,'student_id'=>$studentId,'date'=>$request->date],
                ['present' => $present]
            );
        }

        return redirect()->back()->with('success','Attendance saved');
    }
}
