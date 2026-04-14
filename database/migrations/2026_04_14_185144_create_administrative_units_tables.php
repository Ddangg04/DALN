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
        Schema::create('provinces', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->timestamps();
        });

        Schema::create('districts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->string('province_id');
            $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('wards', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->string('district_id');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wards');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('provinces');
    }
};
