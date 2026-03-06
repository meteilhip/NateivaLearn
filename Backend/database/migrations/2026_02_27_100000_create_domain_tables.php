<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('city')->nullable()->after('phone');
            $table->enum('role', ['learner', 'tutor', 'center_owner'])->default('learner')->after('password');
            $table->foreignId('active_organization_id')->nullable()->after('role')->constrained('organizations')->nullOnDelete();
        });

        Schema::create('organization_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->enum('role', ['owner', 'tutor', 'learner']);
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
            $table->unique(['user_id', 'organization_id']);
        });

        Schema::create('tutor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->text('bio')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->json('languages')->nullable();
            $table->json('subjects')->nullable();
            $table->float('rating')->default(0);
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->nullOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('price', 8, 2)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->boolean('review_given')->default(false);
            $table->timestamps();
        });

        Schema::create('tutor_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('blocked_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->timestamps();
            $table->unique(['tutor_id', 'date']);
        });

        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('time_limit')->nullable();
            $table->timestamps();
        });

        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->text('question');
            $table->timestamps();
        });

        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('quiz_questions')->cascadeOnDelete();
            $table->text('answer');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });

        Schema::create('quiz_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->foreignId('learner_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('completed')->default(false);
            $table->unsignedSmallInteger('score')->nullable();
            $table->timestamps();
            $table->unique(['quiz_id', 'learner_id']);
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['conversation_id', 'user_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        if (! Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->string('tokenable_type');
                $table->unsignedBigInteger('tokenable_id');
                $table->string('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
                $table->index(['tokenable_type', 'tokenable_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('quiz_recipients');
        Schema::dropIfExists('quiz_answers');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('blocked_dates');
        Schema::dropIfExists('tutor_availabilities');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('tutor_profiles');
        Schema::dropIfExists('organization_memberships');

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('active_organization_id');
            $table->dropColumn('role');
            $table->dropColumn('city');
            $table->dropColumn('phone');
        });

        Schema::dropIfExists('organizations');
    }
};
