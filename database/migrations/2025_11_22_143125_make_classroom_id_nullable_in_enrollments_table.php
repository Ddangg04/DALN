<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            // nếu column tồn tại và hiện NOT NULL, chuyển sang nullable
            if (Schema::hasColumn('enrollments', 'classroom_id')) {
                $table->unsignedBigInteger('classroom_id')->nullable()->change();
            } else {
                // nếu column chưa tồn tại thì thêm nullable luôn
                $table->unsignedBigInteger('classroom_id')->nullable()->after('course_id');
            }
        });
    }

    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'classroom_id')) {
                // quay lại NOT NULL nếu cần (cẩn thận: có thể fail nếu tồn NULL)
                $table->unsignedBigInteger('classroom_id')->nullable(false)->change();
            }
        });
    }
};
