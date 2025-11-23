<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClassSectionIdToSchedulesTable extends Migration
{
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->foreignId('class_section_id')->nullable()->after('course_id')->constrained('class_sections')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropConstrainedForeignId('class_section_id');
        });
    }
}
