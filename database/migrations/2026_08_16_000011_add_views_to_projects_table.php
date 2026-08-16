<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Additional views: a project can be presented from several angles (front view,
 * garden view, …), each with its own image and SVG polygons, plus an optional
 * mobile-specific image per view.
 *
 * View 1 stays on the project's own columns (project_image / svg /
 * polygon_data) and gains a label and a mobile image here; views 2..N live in
 * the `views` array.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'views')) {
                $table->json('views')->nullable()->after('images_360');
            }
            if (! Schema::hasColumn('projects', 'view_label')) {
                $table->string('view_label')->nullable()->after('views');
            }
            if (! Schema::hasColumn('projects', 'mobile_image')) {
                $table->longText('mobile_image')->nullable()->after('project_image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['views', 'view_label', 'mobile_image']);
        });
    }
};
