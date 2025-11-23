<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {

            if (!Schema::hasColumn('attendances', 'enrollment_id')) {
                $table->unsignedBigInteger('enrollment_id')->nullable()->after('id');
            }

            if (!Schema::hasColumn('attendances', 'class_session_id')) {
                $table->unsignedBigInteger('class_session_id')->nullable()->after('enrollment_id');
            }

            if (!Schema::hasColumn('attendances', 'status')) {
                $table->string('status', 20)->nullable()->after('date');
            }

            if (!Schema::hasColumn('attendances', 'note')) {
                $table->string('note')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'note')) {
                $table->dropColumn('note');
            }
            if (Schema::hasColumn('attendances', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('attendances', 'class_session_id')) {
                $table->dropColumn('class_session_id');
            }
            if (Schema::hasColumn('attendances', 'enrollment_id')) {
                $table->dropColumn('enrollment_id');
            }
        });
    }
};
