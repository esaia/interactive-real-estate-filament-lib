<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('teaser')->nullable();
            $table->longText('image_2d')->nullable();
            $table->longText('image_3d')->nullable();
            $table->longText('gallery')->nullable();
            $table->decimal('area_m2', 10, 2)->nullable();
            $table->decimal('rooms_count', 5, 1)->nullable();
            $table->json('other')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types');
    }
};
