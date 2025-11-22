<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();

            $table->float('midterm')->nullable();  // Điểm giữa kỳ
            $table->float('final')->nullable();     // Điểm cuối kỳ
            $table->float('other')->nullable();     // Điểm khác
            $table->float('total')->nullable();     // Tổng kết

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
