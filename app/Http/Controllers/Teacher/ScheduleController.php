<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
    /**
     * Show schedules for the logged-in teacher.
     * Finds schedules via classSession.teacher_id
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return Inertia::render('Teacher/Schedule/Index', [
                'schedules' => $this->emptyWeekStructure(),
            ]);
        }

        $teacherId = $user->id;

        $schedules = Schedule::with(['course','classSession.teacher'])
            ->whereHas('classSession', function($q) use ($teacherId) {
                $q->where('teacher_id', $teacherId);
            })
            ->orderByRaw("FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')")
            ->orderBy('start_time')
            ->get();

        $grouped = $this->transformSchedules($schedules);

        return Inertia::render('Teacher/Schedule/Index', [
            'schedules' => $grouped,
        ]);
    }

    protected function transformSchedules($schedules)
    {
        $days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        $data = [];
        foreach ($days as $d) $data[$d] = [];

        foreach ($schedules as $s) {
            $dow = $s->day_of_week;
            if (!in_array($dow, $days)) {
                $map = ['1'=>'Monday','2'=>'Tuesday','3'=>'Wednesday','4'=>'Thursday','5'=>'Friday','6'=>'Saturday','7'=>'Sunday'];
                $dow = $map[(string)$dow] ?? $dow;
            }

            $data[$dow][] = [
                'id' => $s->id,
                'course' => [
                    'id' => $s->course->id ?? null,
                    'name' => $s->course->name ?? null,
                    'code' => $s->course->code ?? null,
                ],
                'class_session' => [
                    'id' => $s->classSession->id ?? null,
                    'class_code' => $s->classSession->class_code ?? null,
                ],
                'day_of_week' => $dow,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'room' => $s->room,
            ];
        }

        foreach ($data as $d => $items) {
            usort($items, function($a,$b){ return strcmp($a['start_time'] ?? '', $b['start_time'] ?? '');});
            $data[$d] = $items;
        }

        return $data;
    }

    protected function emptyWeekStructure()
    {
        return [
            'Monday'=>[],'Tuesday'=>[],'Wednesday'=>[],'Thursday'=>[],
            'Friday'=>[],'Saturday'=>[],'Sunday'=>[]
        ];
    }
}
