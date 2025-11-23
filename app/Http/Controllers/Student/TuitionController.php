<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TuitionFee;
use App\Models\Payment;
use App\Models\Enrollment;
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

        $totalOwed = $tuitionFees->where('status','!=','paid')->sum('remaining_amount');
        $totalPaid = $tuitionFees->sum('paid_amount');

        // pending enrollments tuition
        $enrollments = Enrollment::forStudent($student->id)
                        ->whereIn('status',['pending','approved'])
                        ->with('course')
                        ->get();

        $calculatedPendingAmount = 0;
        $perCredit = config('tuition.per_credit', 0);
        foreach ($enrollments as $en) {
            if (!$en->course) continue;
            if (!is_null($en->course->tuition)) {
                $calculatedPendingAmount += $en->course->tuition;
            } else {
                $calculatedPendingAmount += ($en->course->credits ?? 0) * $perCredit;
            }
        }

        $combinedTotalOwed = $totalOwed + $calculatedPendingAmount;

        return Inertia::render('Student/Tuition/Index', [
            'tuitionFees' => $tuitionFees,
            'stats' => [
                'totalOwed' => $combinedTotalOwed,
                'totalPaid' => $totalPaid,
                'pendingEnrollmentsTuition' => $calculatedPendingAmount,
            ],
        ]);
    }
}
