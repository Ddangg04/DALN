<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'class_session_id',
        'course_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'building',
        'instructor_id',
    ];

    protected $casts = [
        'start_time' => 'string',
        'end_time' => 'string',
    ];

    protected $with = ['instructor'];

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(\App\Models\User::class, 'instructor_id');
    }

    public function classSession()
    {
        return $this->belongsTo(\App\Models\ClassSession::class, 'class_session_id');
    }
}
