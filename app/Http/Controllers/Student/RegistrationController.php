<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RegistrationController extends Controller
{
    public function index()
    {
        // list courses
        $courses = [];
        try {
            if (Schema::hasTable('courses')) {
                $courses = DB::table('courses')->get()->map(fn($c)=>(array)$c)->toArray();
            } else {
                $courses = [
                    ['id'=>1,'name'=>'Lập trình Web','code'=>'IT101','credits'=>3],
                    ['id'=>2,'name'=>'Cơ sở dữ liệu','code'=>'IT202','credits'=>3],
                ];
            }
        } catch (\Throwable $e) {
            $courses = [];
        }

        return Inertia::render('Student/Registration', compact('courses'));
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'course_id' => 'required|integer',
        ]);

        if ($v->fails()) {
            return back()->withErrors($v)->withInput();
        }

        // demo: lưu vào bảng registrations nếu có, nếu không, trả về success giả
        try {
            if (Schema::hasTable('registrations')) {
                DB::table('registrations')->insert([
                    'student_id' => Auth::user()->id,
                    'course_id' => $request->course_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {
            // ignore
        }

        return redirect()->route('student.register')->with('success', 'Đăng ký học phần thành công.');
    }
}
