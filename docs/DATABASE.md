# Database Schema Documentation

## Overview

The Myzuwa waitlist platform is now designed for MySQL 8.0+ and Laravel PHP compatibility, suitable for InfinityFree and similar hosts. This document outlines the MySQL schema, relationships, and Laravel migration notes.

## Database Technology

**Primary: MySQL 8.0+ / MariaDB 10.6+**
- ACID compliance for data integrity
- JSON support (MySQL 5.7+)
- Excellent performance with proper indexing
- Strong ecosystem and tooling

**Backend Framework: Laravel PHP**
- Uses Eloquent ORM and Laravel migrations
- All schema changes should be made via Laravel migrations

## Core Tables (Laravel Migration Format)

### 1. Users Table
Stores admin user accounts and authentication data.

```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('username', 50)->unique();
    $table->string('email', 255)->unique();
    $table->string('password_hash', 255);
    $table->string('role', 20)->default('admin');
    $table->boolean('is_active')->default(true);
    $table->timestamp('last_login')->nullable();
    $table->timestamps();
});
```

### 2. Waitlist Entries Table
Primary table for storing waitlist registrations.

```php
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
```

### 3. Site Content Table
Stores all manageable frontend content.

```php
Schema::create('site_content', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('key', 100)->unique();
    $table->text('value');
    $table->string('type', 20)->default('text');
    $table->string('category', 50);
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->uuid('updated_by')->nullable();
});
```

### 4. Site Settings Table
Stores all configurable site settings.

```php
Schema::create('site_settings', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('key', 100)->unique();
    $table->text('value');
    $table->string('type', 20)->default('text');
    $table->string('category', 50);
    $table->text('description')->nullable();
    $table->boolean('is_sensitive')->default(false);
    $table->timestamps();
    $table->uuid('updated_by')->nullable();
});
```

### 5. Email Templates Table
Stores email templates for automated communications.

```php
Schema::create('email_templates', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name', 100)->unique();
    $table->string('subject', 255);
    $table->text('html_content');
    $table->text('text_content')->nullable();
    $table->json('variables')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->uuid('updated_by')->nullable();
});
```

### 6. Email Queue Table
Manages outgoing email queue and delivery status.

```php
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
```

### 7. Analytics Events Table
Tracks user interactions and system events.

```php
Schema::create('analytics_events', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('event_type', 50);
    $table->json('event_data')->nullable();
    $table->string('user_id', 255)->nullable();
    $table->uuid('waitlist_entry_id')->nullable();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->text('referrer')->nullable();
    $table->text('page_url')->nullable();
    $table->string('utm_source', 100)->nullable();
    $table->string('utm_medium', 100)->nullable();
    $table->string('utm_campaign', 100)->nullable();
    $table->timestamps();
});
```

### 8. Admin Activity Log Table
Tracks admin actions for audit purposes.

```php
Schema::create('admin_activity_log', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id');
    $table->string('action', 100);
    $table->string('resource_type', 50)->nullable();
    $table->uuid('resource_id')->nullable();
    $table->json('old_values')->nullable();
    $table->json('new_values')->nullable();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->timestamps();
});
```

## Data Relationships
- Use Laravel Eloquent relationships (hasMany, belongsTo, etc.)
- Use foreign keys where appropriate

## Data Processing Workflows
- Use Laravel controllers and jobs for registration, analytics, and email workflows

## Indexing & Performance
- Add indexes in migrations as needed (e.g., `$table->index('email')`)
- Use Laravel query builder/Eloquent for optimized queries

## Backup & Recovery
- Use InfinityFree/MySQL tools for backups
- Use Laravel seeders for test data

## Security & GDPR
- Use Laravel validation, encryption, and policies
- Use parameterized queries (Eloquent)
- Add GDPR endpoints as needed

## Migration Strategy
- Use Laravel migrations for all schema changes
- Use Laravel artisan commands for migration and seeding

---

This schema is now fully compatible with MySQL and Laravel on InfinityFree.