<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = [
        'course_id',
        'teacher_id',
        'title',
        'description',
        'due_date',
        'max_score',
        'file_path',
        'status',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'max_score' => 'integer',
    ];

    protected $with = ['course', 'teacher'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    // Check if overdue
    public function getIsOverdueAttribute()
    {
        return $this->due_date < now();
    }

    // Count submissions
    public function getSubmissionsCountAttribute()
    {
        return $this->submissions()->where('status', '!=', 'pending')->count();
    }
}
