<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TuitionFee;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class TuitionController extends Controller
{
    public function index()
    {
        $student = Auth::user();

        $tuitionFees = TuitionFee::where('student_id', $student->id)
                                ->with('payments')
                                ->orderByDesc('year')
                                ->orderByDesc('semester')
                                ->get();

        $totalOwed = $tuitionFees->where('status', '!=', 'paid')->sum('remaining_amount');
        $totalPaid = $tuitionFees->sum('paid_amount');

        return Inertia::render('Student/Tuition/Index', [
            'tuitionFees' => $tuitionFees,
            'stats' => [
                'totalOwed' => $totalOwed,
                'totalPaid' => $totalPaid,
                'overdueFees' => $tuitionFees->where('status', 'overdue')->count(),
            ],
        ]);
    }

    public function show(TuitionFee $tuitionFee)
    {
        $student = Auth::user();

        if ($tuitionFee->student_id !== $student->id) {
            abort(403);
        }

        $tuitionFee->load('payments');

        return Inertia::render('Student/Tuition/Show', [
            'tuitionFee' => $tuitionFee,
        ]);
    }
}
