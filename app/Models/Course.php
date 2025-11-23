<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Schema;
use App\Models\ClassSession;
class Course extends Model
{
    use SoftDeletes;

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

    // Return virtual attribute 'class_sessions' for front-end convenience
    protected $appends = ['class_sessions'];

    // -----------------------
    // Relationships
    // -----------------------
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function classSessions()
    {
        // Ensure you have App\Models\ClassSession class
        return $this->hasMany(ClassSession::class, 'course_id');
    }

    /**
     * schedules via class_sessions
     */
    public function schedules()
    {
        return $this->hasManyThrough(
            Schedule::class,
            ClassSession::class,
            'course_id',        // class_sessions.course_id
            'class_session_id', // schedules.class_session_id
            'id',
            'id'
        );
    }

    /**
     * enrollments via class_sessions -> enrollments(class_session_id)
     */
    public function enrollments()
    {
        return $this->hasManyThrough(
            Enrollment::class,
            ClassSession::class,
            'course_id',        // class_sessions.course_id
            'class_session_id', // enrollments.class_session_id
            'id',
            'id'
        );
    }

    // -----------------------
    // Scopes
    // -----------------------
    public function scopeRequired($query)
    {
        if (Schema::hasColumn($this->getTable(), 'type')) {
            return $query->where($this->getTable() . '.type', 'required');
        }
        return $query;
    }

    public function scopeElective($query)
    {
        if (Schema::hasColumn($this->getTable(), 'type')) {
            return $query->where($this->getTable() . '.type', 'elective');
        }
        return $query;
    }

    public function scopeActive($query)
    {
        if (Schema::hasColumn($this->getTable(), 'is_active')) {
            return $query->where($this->getTable() . '.is_active', true);
        }

        if (Schema::hasColumn($this->getTable(), 'status')) {
            return $query->where($this->getTable() . '.status', 'active');
        }

        return $query;
    }
    // -----------------------
    // Accessors
    // -----------------------
    /**
     * Return an array of class sessions suitable for frontend (appends => 'class_sessions').
     * This uses the relation query directly (not dynamic property) to avoid undefined property issues.
     *
     * @return array
     */
    public function getClassSessionsAttribute()
    {
        // Use the relation query to ensure a Collection is returned regardless of relationLoaded state.
        $sessions = $this->classSessions()
            ->with(['teacher', 'schedules'])
            ->orderBy('class_code')
            ->get();

        return $sessions->map(function ($session) {
            return [
                'id' => $session->id,
                'class_code' => $session->class_code ?? null,
                'teacher_id' => $session->teacher_id ?? null,
                'teacher' => $session->teacher ? [
                    'id' => $session->teacher->id,
                    'name' => $session->teacher->name,
                ] : null,
                'max_students' => $session->max_students ?? null,
                'enrolled_count' => $session->enrolled_count ?? 0,
                'status' => $session->status ?? null,
                'schedules' => $session->schedules->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'day_of_week' => $schedule->day_of_week,
                        'start_time' => $schedule->start_time,
                        'end_time' => $schedule->end_time,
                        'room' => $schedule->room,
                    ];
                })->toArray(),
            ];
        })->toArray();
    }
}
