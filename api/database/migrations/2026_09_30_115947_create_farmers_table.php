<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmers', function (Blueprint $table): void {
            $table->id();
            $table->string('farmer_id')->unique();   // FS-KEN-000001
            $table->string('full_name');
            $table->string('mobile_number', 20);
            $table->string('email')->nullable();
            $table->string('county', 100);
            $table->string('preferred_language', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmers');
    }
};
