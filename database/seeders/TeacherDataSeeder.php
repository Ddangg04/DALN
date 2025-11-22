<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\ClassSession;
use App\Models\TeachingSchedule;
use App\Models\Assignment;

class TeacherDataSeeder extends Seeder
{
    public function run()
    {
        // Create test teacher
        $teacher = User::create([
            'name' => 'Nguyen Van B - Giang Vien',
            'email' => 'teacher@test.com',
            'password' => bcrypt('password'),
        ]);
        $teacher->assignRole('teacher');

        // Create class sessions
        $courses = Course::active()->take(3)->get();
        
        foreach ($courses as $course) {
            $classSession = ClassSession::create([
                'course_id' => $course->id,
                'teacher_id' => $teacher->id,
                'class_code' => $course->code . '-01',
                'semester' => 'Fall',
                'year' => 2024,
                'max_students' => 50,
                'enrolled_count' => 30,
                'status' => 'in_progress',
            ]);

            // Create schedule
            $days = ['Monday', 'Wednesday', 'Friday'];
            foreach ($days as $day) {
                TeachingSchedule::create([
                    'teacher_id' => $teacher->id,
                    'course_id' => $course->id,
                    'class_session_id' => $classSession->id,
                    'day_of_week' => $day,
                    'start_time' => '08:00',
                    'end_time' => '10:00',
                    'room' => 'A' . rand(101, 505),
                    'semester' => 'Fall',
                    'year' => 2024,
                ]);
            }

            // Create assignment
            Assignment::create([
                'course_id' => $course->id,
                'teacher_id' => $teacher->id,
                'title' => 'Assignment 1: ' . $course->name,
                'description' => 'Complete the following exercises...',
                'due_date' => now()->addDays(7),
                'max_score' => 100,
                'status' => 'published',
            ]);
        }
    }
}