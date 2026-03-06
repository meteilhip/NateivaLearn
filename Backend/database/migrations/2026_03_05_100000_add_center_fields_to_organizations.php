<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ajoute au centre (organisation) :
 * - logo : image représentative (URL ou data URL base64)
 * - required_languages : langues exigées pour rejoindre le centre (JSON)
 * - subjects : matières que le centre propose / pour lesquelles les tuteurs sont attendus (JSON, optionnel)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->text('logo')->nullable()->after('description');
            $table->json('required_languages')->nullable()->after('logo');
            $table->json('subjects')->nullable()->after('required_languages');
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['logo', 'required_languages', 'subjects']);
        });
    }
};
