<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_queue', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('to_email', 255);
            $table->string('from_email', 255);
            $table->string('subject', 255);
            $table->text('html_content');
            $table->text('text_content')->nullable();
            $table->uuid('template_id')->nullable();
            $table->uuid('waitlist_entry_id')->nullable();
            $table->string('status', 20)->default('pending');
            $table->integer('attempts')->default(0);
            $table->integer('max_attempts')->default(3);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_queue');
    }
};
