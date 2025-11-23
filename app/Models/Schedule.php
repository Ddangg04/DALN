<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;
    protected $fillable = [
        'course_id',
        'class_session_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'building',
        'instructor_id',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    protected $with = ['course', 'instructor'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
    public function classSession()
    {
        return $this->belongsTo(ClassSession::class, 'class_session_id');
    }
}
