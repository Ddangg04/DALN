<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddClassSessionIdToCourse extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Thêm cột nullable, không dùng ->after để tránh lỗi nếu cột khác không tồn tại
            $table->unsignedBigInteger('class_session_id')->nullable();

            // Nếu bạn muốn FK và bảng class_sessions đã tồn tại:
            // $table->foreign('class_session_id')->references('id')->on('class_sessions')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            // nếu bạn đã tạo FK comment / drop trước
            // $table->dropForeign(['class_session_id']);
            $table->dropColumn('class_session_id');
        });
    }
}
