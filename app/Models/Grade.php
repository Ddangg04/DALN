<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    protected $fillable = [
        'enrollment_id',
        'class_session_id',
        'attendance_score',
        'midterm_score',
        'final_score',
        'bonus_score',
        'total_score',
        'letter_grade',
        'status',
        'note',
        'graded_at',
        'graded_by',
    ];

    protected $casts = [
        'attendance_score' => 'decimal:2',
        'midterm_score' => 'decimal:2',
        'final_score' => 'decimal:2',
        'bonus_score' => 'decimal:2',
        'total_score' => 'decimal:2',
        'graded_at' => 'datetime',
    ];

    // Relationships
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function classSession(): BelongsTo
    {
        return $this->belongsTo(ClassSession::class);
    }

    public function gradedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    // Tính điểm tổng kết
    public function calculateTotalScore(): ?float
    {
        // Nếu thiếu điểm thành phần bắt buộc
        if (is_null($this->midterm_score) || is_null($this->final_score)) {
            return null;
        }

        $attendance = $this->attendance_score ?? 0;
        $midterm = $this->midterm_score;
        $final = $this->final_score;
        $bonus = $this->bonus_score ?? 0;

        // Công thức: 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ + điểm cộng
        $total = ($attendance * 0.1) + ($midterm * 0.3) + ($final * 0.6) + $bonus;

        return min(10, round($total, 2)); // Tối đa 10 điểm
    }

    // Xếp loại chữ
    public function calculateLetterGrade(): ?string
    {
        if (is_null($this->total_score)) {
            return null;
        }

        $score = $this->total_score;

        return match(true) {
            $score >= 9.0 => 'A+',
            $score >= 8.5 => 'A',
            $score >= 8.0 => 'B+',
            $score >= 7.0 => 'B',
            $score >= 6.5 => 'C+',
            $score >= 5.5 => 'C',
            $score >= 5.0 => 'D+',
            $score >= 4.0 => 'D',
            default => 'F',
        };
    }

    // Auto calculate before saving
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($grade) {
            $grade->total_score = $grade->calculateTotalScore();
            $grade->letter_grade = $grade->calculateLetterGrade();
        });
    }
}
