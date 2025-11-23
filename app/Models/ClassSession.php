<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    use HasFactory;

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
        'max_students' => 'integer',
        'enrolled_count' => 'integer',
        'year' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'class_session_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}