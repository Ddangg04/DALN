<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Department;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'credits',
        'type',
        'is_active',
        'department_id',
        'max_students',
        'semester',
        'year',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
        'max_students' => 'integer',
        'year' => 'integer',
    ];

    protected $with = ['department'];

    // Relationship với Department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Scope để lấy courses active
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope để lấy courses required
    public function scopeRequired($query)
    {
        return $query->where('type', 'required');
    }

    // Scope để lấy courses elective
    public function scopeElective($query)
    {
        return $query->where('type', 'elective');
    }

    // Scope search
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // Accessor để format course code
    public function getFullCodeAttribute()
    {
        return strtoupper($this->code);
    }
    public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}

public function schedules()
{
    return $this->hasMany(Schedule::class);
}

public function materials()
{
    return $this->hasMany(Material::class);
}

// Get enrolled students count
public function getEnrolledStudentsCountAttribute()
{
    return $this->enrollments()->where('status', 'approved')->count();
}

// Check if course is full
public function isFullAttribute()
{
    if (!$this->max_students) return false;
    return $this->enrolled_students_count >= $this->max_students;
}
public function classSessions()
    {
        // assuming model is App\Models\ClassSession and FK is course_id
        return $this->hasMany(\App\Models\ClassSession::class, 'course_id', 'id');
    }
}

