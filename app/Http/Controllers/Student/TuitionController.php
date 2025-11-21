<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TuitionController extends Controller
{
    public function index()
    {
        // Try load tuition info
        $tuition = [
            'total' => 1000000,
            'paid' => 500000,
            'outstanding' => 500000,
        ];

        try {
            if (Schema::hasTable('tuitions') && Auth::check()) {
                $tuitionRecord = DB::table('tuitions')->where('student_id', Auth::id())->first();
                if ($tuitionRecord) {
                    $tuition = (array)$tuitionRecord;
                }
            }
        } catch (\Throwable $e) {
            // ignore
        }

        return Inertia::render('Student/Tuition', compact('tuition'));
    }
}
