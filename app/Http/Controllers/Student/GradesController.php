<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class GradesController extends Controller
{
    public function index()
    {
        $grades = [];
        try {
            $grades = DB::table('grades')->where('student_id', Auth::id())->get()->map(fn($g)=>(array)$g)->toArray();
            
            // If no grades found, use sample data
            if (empty($grades)) {
                $grades = [
                    ['course_name'=>'Lập trình Web','course_code'=>'IT101','attendance_score'=>8,'midterm_score'=>7,'final_score'=>8,'average_score'=>7.7,'grade'=>'B+'],
                    ['course_name'=>'CSDL','course_code'=>'IT202','attendance_score'=>9,'midterm_score'=>8,'final_score'=>9,'average_score'=>8.6,'grade'=>'A'],
                ];
            }
        } catch (\Throwable $e) {
            $grades = [];
        }

        return Inertia::render('Student/Grades', compact('grades'));
    }
}
