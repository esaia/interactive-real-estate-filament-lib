<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('floors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('block_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('floor_number');
            $table->string('title');
            $table->text('conf')->nullable();
            $table->longText('svg')->nullable();
            $table->json('polygon_data')->nullable();
            $table->longText('floor_image')->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'floor_number', 'block_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('floors');
    }
};
