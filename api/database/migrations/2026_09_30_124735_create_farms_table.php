<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('farmer_id')->constrained('farmers')->cascadeOnDelete();
            $table->string('farm_name');
            $table->string('location');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('size_acres', 8, 2);
            $table->string('primary_crop');
            $table->string('coffee_varieties')->nullable();
            $table->integer('coffee_tree_count')->nullable();
            $table->decimal('estimated_annual_production', 10, 2)->nullable();
            $table->string('last_harvest_date')->nullable();
            $table->json('challenges');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farms');
    }
};
