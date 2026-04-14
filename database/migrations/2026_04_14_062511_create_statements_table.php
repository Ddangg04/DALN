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
        Schema::create('statements', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->dateTime('transaction_date');
            $blueprint->decimal('amount', 20, 2);
            $blueprint->string('content');
            $blueprint->string('account_name')->nullable();
            $blueprint->enum('type', ['in', 'out'])->default('in');
            $blueprint->foreignId('campaign_id')->nullable()->constrained()->onDelete('set null');
            $blueprint->string('transaction_id')->unique()->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statements');
    }
};
