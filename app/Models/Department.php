<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['code', 'name', 'description'];

    // Relationship với Courses
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    // Count courses
    public function getCoursesCountAttribute()
    {
        return $this->courses()->count();
    }
}
