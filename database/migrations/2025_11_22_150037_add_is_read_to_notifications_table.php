<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('notifications')) {
            return;
        }

        Schema::table('notifications', function (Blueprint $table) {
            if (! Schema::hasColumn('notifications', 'is_read')) {
                // Thêm cột is_read, KHÔNG dùng ->after(...) để tránh lỗi nếu cột không tồn tại
                $table->boolean('is_read')->default(false);
            }
        });
    }

    public function down()
    {
        if (! Schema::hasTable('notifications')) {
            return;
        }

        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'is_read')) {
                $table->dropColumn('is_read');
            }
        });
    }
};

