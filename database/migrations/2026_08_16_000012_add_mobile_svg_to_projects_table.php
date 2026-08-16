<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A view's mobile image is usually a different crop, so it carries its own SVG
 * and polygons rather than reusing the desktop ones. These two columns hold
 * them for view 1; views 2..N keep theirs inside the `views` array.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'mobile_svg')) {
                $table->longText('mobile_svg')->nullable()->after('mobile_image');
            }
            if (! Schema::hasColumn('projects', 'mobile_polygon_data')) {
                $table->json('mobile_polygon_data')->nullable()->after('mobile_svg');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['mobile_svg', 'mobile_polygon_data']);
        });
    }
};
