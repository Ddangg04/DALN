<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrollment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_id',
        'course_id',
        'status',
        'midterm_score',
        'final_score',
        'total_score',
        'grade',
    ];

    protected $casts = [
        'midterm_score' => 'decimal:2',
        'final_score' => 'decimal:2',
        'total_score' => 'decimal:2',
    ];

    protected $with = ['course', 'student'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    // Calculate total score
    public function calculateTotalScore()
    {
        $total = 0;
        foreach ($this->grades as $grade) {
            $total += $grade->score * $grade->weight;
        }
        
        $this->total_score = $total;
        $this->grade = $this->calculateLetterGrade($total);
        $this->save();
        
        return $total;
    }

    // Calculate letter grade
    private function calculateLetterGrade($score)
    {
        if ($score >= 95) return 'A+';
        if ($score >= 90) return 'A';
        if ($score >= 85) return 'B+';
        if ($score >= 80) return 'B';
        if ($score >= 75) return 'C+';
        if ($score >= 70) return 'C';
        if ($score >= 65) return 'D+';
        if ($score >= 60) return 'D';
        return 'F';
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}