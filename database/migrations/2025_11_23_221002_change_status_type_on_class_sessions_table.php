<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeStatusTypeOnClassSessionsTable extends Migration
{
    public function up()
    {
        Schema::table('class_sessions', function (Blueprint $table) {
            // chuyển sang varchar(50) và set default 'active'
            $table->string('status', 50)->default('active')->change();
        });
    }

    public function down()
    {
        Schema::table('class_sessions', function (Blueprint $table) {
            // nếu trước đó là tinyint(1), đổi lại (thay bằng kiểu cũ nếu biết)
            $table->tinyInteger('status')->default(1)->change();
        });
    }
}
