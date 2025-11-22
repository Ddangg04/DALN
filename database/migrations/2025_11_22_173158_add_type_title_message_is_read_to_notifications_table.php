<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up()
    {
        if (! Schema::hasTable('notifications')) return;
        Schema::table('notifications', function (Blueprint $table) {
            if (! Schema::hasColumn('notifications','type')) {
                $table->string('type')->nullable();
            }
            if (! Schema::hasColumn('notifications','title')) {
                $table->string('title')->nullable();
            }
            if (! Schema::hasColumn('notifications','message')) {
                $table->text('message')->nullable();
            }
            if (! Schema::hasColumn('notifications','is_read')) {
                $table->boolean('is_read')->default(false);
            }
        });
    }
    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications','type')) $table->dropColumn('type');
            if (Schema::hasColumn('notifications','title')) $table->dropColumn('title');
            if (Schema::hasColumn('notifications','message')) $table->dropColumn('message');
            if (Schema::hasColumn('notifications','is_read')) $table->dropColumn('is_read');
        });
    }
};
