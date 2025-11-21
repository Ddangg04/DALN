<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnouncementsTable extends Migration
{
    public function up()
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->timestamps();

            // nếu muốn: khóa ngoại đến users (bỏ comment nếu chắc chắn có users table)
            // $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('announcements');
    }
}
