<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    public function index()
    {
        $requests = [];
        try {
            $requests = DB::table('student_requests')
                ->where('student_id', Auth::id())
                ->get()
                ->map(fn($r) => (array)$r)
                ->toArray();
        } catch (\Throwable $e) {
            $requests = [];
        }

        return Inertia::render('Student/Requests', compact('requests'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            DB::table('student_requests')->insert([
                'student_id' => Auth::id(),
                'type' => $data['type'],
                'message' => $data['message'],
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Gửi yêu cầu thành công.');
    }
}
