<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            if (! Schema::hasColumn('courses', 'status')) {
                // text/ngắn: dùng string để lưu 'active','inactive',...
                $table->string('status')->nullable()->after('year')->default('active');
            }
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
