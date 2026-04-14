<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            if (!Schema::hasColumn('activity_log', 'log_name')) {
                $table->string('log_name')->nullable()->after('id');
            }
            if (!Schema::hasColumn('activity_log', 'description')) {
                $table->text('description')->after('log_name')->nullable();
            }
            if (!Schema::hasColumn('activity_log', 'subject_type')) {
                $table->string('subject_type')->nullable()->after('description');
            }
            if (!Schema::hasColumn('activity_log', 'subject_id')) {
                $table->unsignedBigInteger('subject_id')->nullable()->after('subject_type');
            }
            if (!Schema::hasColumn('activity_log', 'causer_type')) {
                $table->string('causer_type')->nullable()->after('subject_id');
            }
            if (!Schema::hasColumn('activity_log', 'causer_id')) {
                $table->unsignedBigInteger('causer_id')->nullable()->after('causer_type');
            }
            if (!Schema::hasColumn('activity_log', 'properties')) {
                $table->json('properties')->nullable()->after('causer_id');
            }
            if (!Schema::hasColumn('activity_log', 'batch_uuid')) {
                $table->uuid('batch_uuid')->nullable()->after('properties');
            }
            if (!Schema::hasColumn('activity_log', 'event')) {
                $table->string('event')->nullable()->after('batch_uuid');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropColumn(['log_name', 'description', 'subject_type', 'subject_id', 'causer_type', 'causer_id', 'properties', 'batch_uuid', 'event']);
        });
    }
};
