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

        // schedules linked to class_session that student is enrolled in (pending/approved)
        $schedules = Schedule::whereHas('classSession.enrollments', function($q) use ($student){
            $q->where('student_id', $student->id)
              ->whereIn('status', ['pending','approved']);
        })->with(['classSession','classSession.course','classSession.teacher'])->get()
          ->groupBy('day_of_week');

        $daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        $organized = collect($daysOrder)->mapWithKeys(function($d) use ($schedules){
            return [$d => $schedules->get($d, collect())->sortBy('start_time')->values()];
        });

        return Inertia::render('Student/Schedule/Index', [
            'schedules' => $organized,
        ]);
    }
}
