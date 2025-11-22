<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Course;
use Carbon\Carbon;

class StudentDataSeeder extends Seeder
{
    public function run()
    {
        // Tạo hoặc cập nhật user (idempotent)
        $student = User::updateOrCreate(
            ['email' => 'student@test.com'],
            [
                'name' => 'Nguyen Van A',
                'password' => Hash::make('password'),
            ]
        );

        // gán role nếu dùng spatie (chỉ gán khi chưa có)
        if (method_exists($student, 'hasRole')) {
            if (! $student->hasRole('student')) {
                $student->assignRole('student');
            }
        }

        // Lấy các học phần active (nếu không có sẽ trả collection rỗng)
        $courses = Course::query()->limit(5)->get();

        foreach ($courses as $course) {
            // Build dữ liệu enrollment dựa trên cột tồn tại
            $enrollmentData = [
                'student_id' => $student->id,
            ];

            if (Schema::hasColumn('enrollments', 'course_id')) {
                $enrollmentData['course_id'] = $course->id;
            }

            if (Schema::hasColumn('enrollments', 'status')) {
                $enrollmentData['status'] = 'approved';
            }

            if (Schema::hasColumn('enrollments', 'midterm_score')) {
                $enrollmentData['midterm_score'] = rand(70, 95);
            }

            if (Schema::hasColumn('enrollments', 'final_score')) {
                $enrollmentData['final_score'] = rand(70, 95);
            }

            if (Schema::hasColumn('enrollments', 'classroom_id')) {
                $enrollmentData['classroom_id'] = DB::table('classrooms')->value('id') ?? null;
            }

            // Insert hoặc update theo student+course (hoặc student nếu không có course_id)
            $where = ['student_id' => $student->id];
            if (isset($enrollmentData['course_id'])) {
                $where['course_id'] = $enrollmentData['course_id'];
            }

            DB::table('enrollments')->updateOrInsert(
                $where,
                array_merge($enrollmentData, [
                    'updated_at' => Carbon::now(),
                    'created_at' => Carbon::now(),
                ])
            );

            // Tính toán tổng điểm và grade nếu cột tồn tại
            $enrollmentId = DB::table('enrollments')->where($where)->value('id');
            if ($enrollmentId) {
                $en = DB::table('enrollments')->where('id', $enrollmentId)->first();

                $mid = $en->midterm_score ?? null;
                $fin = $en->final_score ?? null;
                $total = null;
                if (!is_null($mid) && !is_null($fin)) {
                    $total = ($mid * 0.4) + ($fin * 0.6);
                }

                $update = [];
                if ($total !== null && Schema::hasColumn('enrollments', 'total_score')) {
                    $update['total_score'] = (int) round($total);
                }
                if ($total !== null && Schema::hasColumn('enrollments', 'grade')) {
                    $update['grade'] = $this->calculateGrade($total);
                }
                if (!empty($update)) {
                    $update['updated_at'] = Carbon::now();
                    DB::table('enrollments')->where('id', $enrollmentId)->update($update);
                }
            }

            // Tạo schedule/material/tuition/notification tương tự an toàn nếu cần...
        }
    }

    private function calculateGrade($score)
    {
        if ($score >= 95) return 'A+';
        if ($score >= 90) return 'A';
        if ($score >= 85) return 'B+';
        if ($score >= 80) return 'B';
        if ($score >= 75) return 'C+';
        if ($score >= 70) return 'C';
        if ($score >= 65) return 'D+';
        if ($score >= 60) return 'D';
        return 'F';
    }
}
