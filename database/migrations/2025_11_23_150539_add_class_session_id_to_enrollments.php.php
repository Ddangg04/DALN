<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClassSessionIdToEnrollments extends Migration
{
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollments', 'class_session_id')) {
                $table->foreignId('class_session_id')->nullable()->after('course_id')
                      ->constrained('class_sessions')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'class_session_id')) {
                $table->dropForeign(['class_session_id']);
                $table->dropColumn('class_session_id');
            }
        });
    }
}
