<?php
namespace App\Http\Controllers\GiangVien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Grade;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index($courseId)
    {
        $course = Course::with('grades.student')->findOrFail($courseId);
        return Inertia::render('GiangVien/Grades/Index', compact('course'));
    }

    public function save(Request $request, $courseId)
    {
        $request->validate([
            'grades' => 'required|array'
        ]);
        foreach($request->grades as $studentId => $value){
            Grade::updateOrCreate(
                ['course_id'=>$courseId,'student_id'=>$studentId],
                ['value'=>$value]
            );
        }
        return redirect()->back()->with('success','Grades saved');
    }

    public function export($courseId)
    {
        // TODO: generate CSV/XLSX export
        return redirect()->back();
    }
}
