<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (! Schema::hasColumn('reports', 'title')) {
                $table->string('title')->nullable()->after('type');
            }

            if (! Schema::hasColumn('reports', 'name')) {
                $table->string('name')->nullable()->after('title');
            }

            if (! Schema::hasColumn('reports', 'data')) {
                $table->json('data')->nullable()->after('type');
            }

            if (! Schema::hasColumn('reports', 'created_by')) {
                $table->unsignedBigInteger('created_by')->nullable()->after('data');
            }

            if (! Schema::hasColumn('reports', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('created_by');
            }

            if (! Schema::hasColumn('reports', 'status')) {
                $table->string('status')->default('draft')->after('published_at');
            }

            if (! Schema::hasColumn('reports', 'slug')) {
                $table->string('slug')->nullable()->unique()->after('title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (Schema::hasColumn('reports', 'slug')) $table->dropColumn('slug');
            if (Schema::hasColumn('reports', 'status')) $table->dropColumn('status');
            if (Schema::hasColumn('reports', 'published_at')) $table->dropColumn('published_at');
            if (Schema::hasColumn('reports', 'name')) $table->dropColumn('name');
            if (Schema::hasColumn('reports', 'title')) $table->dropColumn('title');
            if (Schema::hasColumn('reports', 'data')) $table->dropColumn('data');
            if (Schema::hasColumn('reports', 'created_by')) $table->dropColumn('created_by');
        });
    }
};
