<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index()
    {
        $teacher = Auth::user();

        $schedules = TeachingSchedule::where('teacher_id', $teacher->id)
                                    ->with(['course', 'classSession'])
                                    ->get()
                                    ->groupBy('day_of_week');

        $daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        $organizedSchedule = collect($daysOrder)->mapWithKeys(function($day) use ($schedules) {
            return [$day => $schedules->get($day, collect())->sortBy('start_time')->values()];
        });

        return Inertia::render('Teacher/Schedule/Index', [
            'schedules' => $organizedSchedule,
        ]);
    }
}