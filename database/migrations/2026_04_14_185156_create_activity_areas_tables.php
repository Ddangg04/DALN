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
        Schema::create('activity_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ward_id')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('description')->nullable();
            $table->foreign('ward_id')->references('id')->on('wards')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('campaign_activity_area', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
            $table->foreignId('activity_area_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_activity_area');
        Schema::dropIfExists('activity_areas');
    }
};
