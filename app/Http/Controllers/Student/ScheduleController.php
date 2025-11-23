<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index()
    {
        $student = Auth::user();

        // Lấy tất cả schedule của các course mà sinh viên có enrollment pending OR approved
        // (trước đó chỉ lấy approved nên đăng ký mới chưa hiện)
        $schedules = Schedule::whereHas('course.enrollments', function($q) use ($student) {
                            $q->where('student_id', $student->id)
                              ->whereIn('status', ['pending', 'approved']);
                        })
                        ->with(['course.department', 'instructor'])
                        ->get()
                        ->groupBy('day_of_week');

        // Week days order
        $daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        $organizedSchedule = collect($daysOrder)->mapWithKeys(function($day) use ($schedules) {
            return [$day => $schedules->get($day, collect())->sortBy('start_time')->values()];
        });

        return Inertia::render('Student/Schedule/Index', [
            'schedules' => $organizedSchedule,
        ]);
    }
}
