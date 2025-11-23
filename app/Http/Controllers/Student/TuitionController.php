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

        // TuitionFee lưu trong DB (những kỳ đã được tạo)
        $tuitionFees = TuitionFee::where('student_id', $student->id)
                                ->with('payments')
                                ->orderByDesc('year')
                                ->orderByDesc('semester')
                                ->get();

        // Tính tổng từ tuitionFees hiện có
        $totalOwed = $tuitionFees->where('status', '!=', 'paid')->sum('remaining_amount');
        $totalPaid = $tuitionFees->sum('paid_amount');

        // --- BỔ SUNG: Tạm tính học phí từ các enrollment (pending/approved) nếu hệ thống bạn chưa sinh TuitionFee ---
        // Giả sử Course model có trường 'tuition' hoặc tính = credits * config('tuition.per_credit', 0)
        $enrollments = Enrollment::forStudent($student->id)
                        ->whereIn('status', ['pending', 'approved'])
                        ->with('course')
                        ->get();

        $perCreditRate = config('tuition.per_credit', 0); // set ở config nếu có
        $calculatedPendingAmount = 0;
        foreach ($enrollments as $en) {
            if (!$en->course) continue;
            if (isset($en->course->tuition) && $en->course->tuition !== null) {
                $calculatedPendingAmount += $en->course->tuition;
            } else {
                $calculatedPendingAmount += ($en->course->credits ?? 0) * $perCreditRate;
            }
        }

        // Nếu bạn muốn hiển thị tổng học phí (kết hợp DB + tạm tính), gộp vào stats
        $combinedTotalOwed = $totalOwed + $calculatedPendingAmount;

        return Inertia::render('Student/Tuition/Index', [
            'tuitionFees' => $tuitionFees,
            'stats' => [
                'totalOwed' => $combinedTotalOwed,
                'totalPaid' => $totalPaid,
                'overdueFees' => $tuitionFees->where('status', 'overdue')->count(),
                // thêm trường helper cho debug / hiển thị nếu cần
                'pendingEnrollmentsTuition' => $calculatedPendingAmount,
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
