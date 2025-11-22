<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    protected $fillable = [
        'assignment_id',
        'student_id',
        'content',
        'file_path',
        'score',
        'feedback',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'submitted_at' => 'datetime',
    ];

    protected $with = ['student'];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Check if late
    public function getIsLateAttribute()
    {
        if (!$this->submitted_at) return false;
        return $this->submitted_at > $this->assignment->due_date;
    }
}
