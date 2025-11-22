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

    protected $with = ['course', 'teacher'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function schedules()
    {
        return $this->hasMany(TeachingSchedule::class);
    }

    // Check if class is full
    public function isFullAttribute()
    {
        return $this->enrolled_count >= $this->max_students;
    }

    // Update enrolled count
    public function updateEnrolledCount()
    {
        $this->enrolled_count = $this->enrollments()->where('status', 'approved')->count();
        $this->save();
    }
     public function classSessions()
    {
        // nếu model ClassSession namespace khác, điều chỉnh đường dẫn
        return $this->hasMany(\App\Models\ClassSession::class, 'course_id', 'id');
    }
}
