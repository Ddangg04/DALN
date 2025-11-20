<?php
namespace App\Http\Controllers\SinhVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function available()
    {
        $courses = Course::with('department')->paginate(20);
        return Inertia::render('SinhVien/Courses/Available', compact('courses'));
    }

    public function enroll(Request $request, Course $course)
    {
        $user = Auth::user();
        // check already enrolled or conflicts...
        Enrollment::firstOrCreate([
            'course_id' => $course->id,
            'student_id' => $user->id
        ]);
        return redirect()->route('sinhvien.enrollments.index')->with('success','Enrolled');
    }
    public function index()
    {
        $enrollments = Enrollment::with('course')->where('student_id', Auth::id())->paginate(20);
        return Inertia::render('SinhVien/Courses/Index', compact('enrollments'));
    }

    public function cancel($id)
    {
        $enrollment = Enrollment::where('id',$id)->where('student_id', Auth::id())->firstOrFail();
        $enrollment->delete();
        return redirect()->back()->with('success','Enrollment cancelled');
    }
}
