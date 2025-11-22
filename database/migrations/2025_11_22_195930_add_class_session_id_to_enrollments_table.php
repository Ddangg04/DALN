<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('enrollments', function (Blueprint $table) {
        if (!Schema::hasColumn('enrollments', 'class_session_id')) {
            $table->unsignedBigInteger('class_session_id')->nullable()->after('course_id');

            $table->foreign('class_session_id')
                  ->references('id')
                  ->on('class_sessions')
                  ->onDelete('cascade');
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

};
