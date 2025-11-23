<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
public function index()
{
    $student = Auth::user();
    if (!$student) {
        return Inertia::render('Student/Schedule/Index', [
            'schedules' => $this->emptyWeekStructure(),
        ]);
    }

    // Load enrollments with course -> classSessions -> schedules
    $enrollments = \App\Models\Enrollment::with('course.classSessions.schedules')
        ->where('student_id', $student->id)
        ->get();

    $classSessionIds = [];

    foreach ($enrollments as $en) {
        // 1) If enrollment already has class_session_id, use it
        if (!empty($en->class_session_id)) {
            $classSessionIds[] = $en->class_session_id;
            continue;
        }

        // 2) Otherwise try to read course->classSessions
        $course = $en->course ?? null;

        if ($course) {
            // course->classSessions might be a Collection (models) OR an array (if converted)
            $sessions = $course->classSessions ?? null;

            // If it's a method/relationship but returned as array (e.g. due to accessor),
            // try to read the 'class_sessions' appended attribute as fallback
            if (empty($sessions) && isset($course->class_sessions)) {
                $sessions = $course->class_sessions;
            }

            if (is_iterable($sessions)) {
                foreach ($sessions as $cs) {
                    // $cs may be object (model) or array
                    if (is_array($cs)) {
                        if (!empty($cs['id'])) $classSessionIds[] = $cs['id'];
                    } elseif (is_object($cs)) {
                        if (isset($cs->id)) $classSessionIds[] = $cs->id;
                    }
                }
            } else {
                // fallback: query DB for class sessions of this course id
                if (isset($course->id)) {
                    $ids = \App\Models\ClassSession::where('course_id', $course->id)->pluck('id')->toArray();
                    if (!empty($ids)) $classSessionIds = array_merge($classSessionIds, $ids);
                }
            }
        }
    }

    // unique & filter
    $classSessionIds = array_values(array_unique(array_filter($classSessionIds)));

    if (empty($classSessionIds)) {
        return Inertia::render('Student/Schedule/Index', [
            'schedules' => $this->emptyWeekStructure(),
        ]);
    }

    // Get schedules and eager load relations as models
    $schedules = \App\Models\Schedule::with(['classSession.course', 'classSession.teacher'])
        ->whereIn('class_session_id', $classSessionIds)
        ->orderBy('day_of_week')
        ->orderBy('start_time')
        ->get();

    // Map day_of_week -> English names if necessary
    $dayMap = [
        '1' => 'Monday','2' => 'Tuesday','3' => 'Wednesday',
        '4' => 'Thursday','5' => 'Friday','6' => 'Saturday','7' => 'Sunday',
        'Thứ 2' => 'Monday','Thứ 3' => 'Tuesday','Thứ 4' => 'Wednesday',
        'Thứ 5' => 'Thursday','Thứ 6' => 'Friday','Thứ 7' => 'Saturday',
        'Chủ nhật' => 'Sunday',
    ];
    $daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    $grouped = array_fill_keys($daysOrder, []);

    foreach ($schedules as $sch) {
        // ensure classSession may be object or array
        $cs = $sch->classSession ?? null;
        if (is_array($cs) && isset($cs['id'])) {
            $csId = $cs['id'];
            $csCourse = $cs['course'] ?? null;
            $csTeacher = $cs['teacher'] ?? null;
            $csClassCode = $cs['class_code'] ?? null;
        } elseif (is_object($cs)) {
            $csId = $cs->id ?? null;
            $csCourse = $cs->course ?? null;
            $csTeacher = $cs->teacher ?? null;
            $csClassCode = $cs->class_code ?? null;
        } else {
            $csId = null;
            $csCourse = null;
            $csTeacher = null;
            $csClassCode = null;
        }

        // map day_of_week to English names if needed
        $rawDow = (string) ($sch->day_of_week ?? '');
        $dow = $dayMap[$rawDow] ?? $rawDow;
        if (!in_array($dow, $daysOrder)) {
            $dow = $dayMap[$rawDow] ?? ($sch->day_of_week ?: 'Monday');
        }

        // build safe course/class/instructor arrays for frontend
        $courseArr = null;
        if ($csCourse) {
            if (is_array($csCourse)) {
                $courseArr = [
                    'id' => $csCourse['id'] ?? null,
                    'name' => $csCourse['name'] ?? null,
                    'code' => $csCourse['code'] ?? null,
                ];
            } elseif (is_object($csCourse)) {
                $courseArr = [
                    'id' => $csCourse->id ?? null,
                    'name' => $csCourse->name ?? null,
                    'code' => $csCourse->code ?? null,
                ];
            }
        }

        $classSessionArr = null;
        if ($csId !== null || $csClassCode !== null) {
            $classSessionArr = [
                'id' => $csId,
                'class_code' => $csClassCode,
            ];
        }

        $instructorArr = null;
        if ($csTeacher) {
            if (is_array($csTeacher)) {
                $instructorArr = [
                    'id' => $csTeacher['id'] ?? null,
                    'name' => $csTeacher['name'] ?? null,
                ];
            } elseif (is_object($csTeacher)) {
                $instructorArr = [
                    'id' => $csTeacher->id ?? null,
                    'name' => $csTeacher->name ?? null,
                ];
            }
        }

        $grouped[$dow][] = [
            'id' => $sch->id,
            'course' => $courseArr,
            'class_session' => $classSessionArr,
            'instructor' => $instructorArr,
            'day_of_week' => $dow,
            'start_time' => $sch->start_time,
            'end_time' => $sch->end_time,
            'room' => $sch->room,
        ];
    }

    // sort each day
    foreach ($grouped as $k => $arr) {
        usort($arr, function($a, $b) {
            return strcmp($a['start_time'] ?? '', $b['start_time'] ?? '');
        });
        $grouped[$k] = $arr;
    }

    return Inertia::render('Student/Schedule/Index', [
        'schedules' => $grouped,
    ]);
}


private function emptyWeekStructure()
{
    return [
        'Monday' => [],
        'Tuesday' => [],
        'Wednesday' => [],
        'Thursday' => [],
        'Friday' => [],
        'Saturday' => [],
        'Sunday' => [],
    ];
}

}
