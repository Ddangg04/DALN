<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Nếu có cột present thì mới chuyển dữ liệu
        if (Schema::hasColumn('attendances', 'present')) {

            DB::statement("
                UPDATE attendances
                SET status = CASE
                    WHEN present IN (1, '1', 'true') THEN 'present'
                    WHEN present IN (0, '0', 'false') THEN 'absent'
                    ELSE NULL
                END
            ");

            // Drop present safely
            Schema::table('attendances', function (Blueprint $table) {
                $table->dropColumn('present');
            });
        }
    }

    public function down(): void
    {
        // Nếu down migrate → thêm lại present
        Schema::table('attendances', function (Blueprint $table) {
            $table->boolean('present')->nullable();
        });
    }
};
