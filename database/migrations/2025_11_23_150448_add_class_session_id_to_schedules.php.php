<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClassSessionIdToSchedules extends Migration
{
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('schedules', 'class_session_id')) {
                $table->foreignId('class_session_id')->nullable()->after('course_id')
                      ->constrained('class_sessions')->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            if (Schema::hasColumn('schedules', 'class_session_id')) {
                $table->dropForeign(['class_session_id']);
                $table->dropColumn('class_session_id');
            }
        });
    }
}
