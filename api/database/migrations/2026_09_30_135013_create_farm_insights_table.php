<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farm_insights', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('farm_id')->unique()->constrained('farms')->cascadeOnDelete();
            $table->integer('score');
            $table->text('summary');
            $table->json('recommendations');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farm_insights');
    }
};
