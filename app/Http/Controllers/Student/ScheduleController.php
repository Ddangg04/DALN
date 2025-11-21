<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        // Fetch real schedule from DB if exists, else sample
        $schedule = [];
        
        try {
            $userId = Auth::check() ? Auth::id() : null;
            if ($userId) {
                $schedule = DB::table('schedules')->where('student_id', $userId)->get()->map(fn($r)=>(array)$r)->toArray();
            }
            
            if (empty($schedule)) {
                $schedule = [
                    ['course_name'=>'Lập trình Web','day'=>'Thứ 2','start_time'=>'08:00','end_time'=>'09:45','room'=>'P101','teacher_name'=>'TS. A'],
                    ['course_name'=>'CSDL','day'=>'Thứ 3','start_time'=>'10:00','end_time'=>'11:45','room'=>'P202','teacher_name'=>'ThS. B'],
                ];
            }
        } catch (\Throwable $e) {
            $schedule = [];
        }

        return Inertia::render('Student/Schedule', compact('schedule'));
    }
}
