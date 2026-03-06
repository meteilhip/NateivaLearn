<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutor_profiles', function (Blueprint $table) {
            if (! Schema::hasColumn('tutor_profiles', 'video_url')) {
                $table->string('video_url', 500)->nullable()->after('subjects');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tutor_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('tutor_profiles', 'video_url')) {
                $table->dropColumn('video_url');
            }
        });
    }
};

