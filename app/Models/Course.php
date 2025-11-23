<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'tuition',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
        'max_students' => 'integer',
        'year' => 'integer',
        'tuition' => 'decimal:2',
    ];


    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function classSessions()
    {
        return $this->hasMany(ClassSession::class, 'course_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRequired($query)
    {
        return $query->where('type', 'required');
    }

    public function scopeElective($query)
    {
        return $query->where('type', 'elective');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getFullCodeAttribute()
    {
        return strtoupper($this->code);
    }

    public function getEnrolledStudentsCountAttribute()
    {
        return $this->enrollments()->where('status', 'approved')->count();
    }

    public function getIsFullAttribute()
    {
        if (!$this->max_students) return false;
        return $this->enrolled_students_count >= $this->max_students;
    }

    public function getFormattedTuitionAttribute()
    {
        if (!$this->tuition) return 'Chưa có';
        return number_format($this->tuition, 0, ',', '.') . ' VNĐ';
    }
}
