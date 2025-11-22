<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeachingSchedule extends Model
{
    protected $fillable = [
        'teacher_id',
        'course_id',
        'class_session_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'building',
        'semester',
        'year',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'year' => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function classSession()
    {
        return $this->belongsTo(ClassSession::class);
    }
}