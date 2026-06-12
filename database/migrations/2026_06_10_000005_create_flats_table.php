<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('block_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('floor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('type_id')->nullable()->constrained('types')->nullOnDelete();
            $table->string('flat_number');
            $table->boolean('is_active')->default(true);
            $table->string('conf')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('offer_price', 12, 2)->nullable();
            $table->boolean('request_price')->default(false);
            $table->string('click_action')->nullable();
            $table->json('follow_link')->nullable();
            $table->string('use_type')->nullable();
            $table->longText('flat_type')->nullable();
            $table->json('files')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flats');
    }
};
