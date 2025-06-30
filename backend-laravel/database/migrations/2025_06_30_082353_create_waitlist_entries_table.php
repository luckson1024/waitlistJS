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
        Schema::create('waitlist_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email', 255)->unique();
            $table->string('full_name', 255)->nullable();
            $table->string('phone_number', 50)->nullable();
            $table->string('type_of_business', 100)->nullable();
            $table->text('custom_business_types')->nullable();
            $table->string('country', 100)->nullable();
            $table->string('custom_country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->boolean('has_run_store_before')->default(false);
            $table->boolean('wants_tutorial_book')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('referrer')->nullable();
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 100)->nullable();
            $table->string('status', 20)->default('active');
            $table->boolean('email_verified')->default(false);
            $table->string('email_verification_token', 255)->nullable();
            $table->timestamp('email_verification_sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waitlist_entries');
    }
};
