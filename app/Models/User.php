<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles; 

    protected $fillable = [
        'name',
        'email',
        'password',
        'roles',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function enrollments()
{
    return $this->hasMany(Enrollment::class, 'student_id');
}

public function tuitionFees()
{
    return $this->hasMany(TuitionFee::class, 'student_id');
}

public function notifications()
{
    return $this->hasMany(Notification::class);
}
public function teachingClasses()
{
    return $this->hasMany(ClassSession::class, 'teacher_id');
}

public function teachingSchedules()
{
    return $this->hasMany(TeachingSchedule::class, 'teacher_id');
}

public function assignments()
{
    return $this->hasMany(Assignment::class, 'teacher_id');
}
}
