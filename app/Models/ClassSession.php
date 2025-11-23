<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    protected $table = 'class_sessions';

    protected $fillable = [
        'course_id',
        'teacher_id',
        'class_code',
        'semester',
        'year',
        'max_students',
        'enrolled_count',
        'status',
    ];

    protected $casts = [
        'year' => 'integer',
        'max_students' => 'integer',
        'enrolled_count' => 'integer',
    ];

    protected $with = ['teacher'];

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(\App\Models\User::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(\App\Models\Enrollment::class, 'class_session_id');
    }

    public function schedules()
    {
        return $this->hasMany(\App\Models\Schedule::class, 'class_session_id');
    }

    public function getIsFullAttribute()
    {
        if (!$this->max_students) return false;
        return ($this->enrolled_count ?? 0) >= $this->max_students;
    }

    public function updateEnrolledCount()
    {
        $this->enrolled_count = $this->enrollments()->where('status', 'approved')->count();
        $this->save();
    }
}
