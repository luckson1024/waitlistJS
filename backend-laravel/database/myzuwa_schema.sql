-- Myzuwa Waitlist Platform: MySQL Database Schema
-- Compatible with MySQL 8.0+ and Laravel migrations

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` CHAR(36) PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin',
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Waitlist Entries Table
CREATE TABLE IF NOT EXISTS `waitlist_entries` (
    `id` CHAR(36) PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `full_name` VARCHAR(255),
    `phone_number` VARCHAR(50),
    `type_of_business` VARCHAR(100),
    `custom_business_types` TEXT,
    `country` VARCHAR(100),
    `custom_country` VARCHAR(100),
    `city` VARCHAR(100),
    `has_run_store_before` BOOLEAN DEFAULT FALSE,
    `wants_tutorial_book` BOOLEAN DEFAULT FALSE,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `referrer` TEXT,
    `utm_source` VARCHAR(100),
    `utm_medium` VARCHAR(100),
    `utm_campaign` VARCHAR(100),
    `status` VARCHAR(20) DEFAULT 'active',
    `email_verified` BOOLEAN DEFAULT FALSE,
    `email_verification_token` VARCHAR(255),
    `email_verification_sent_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Site Content Table
CREATE TABLE IF NOT EXISTS `site_content` (
    `id` CHAR(36) PRIMARY KEY,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    `value` TEXT NOT NULL,
    `type` VARCHAR(20) DEFAULT 'text',
    `category` VARCHAR(50),
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` CHAR(36)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` CHAR(36) PRIMARY KEY,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    `value` TEXT NOT NULL,
    `type` VARCHAR(20) DEFAULT 'text',
    `category` VARCHAR(50),
    `description` TEXT,
    `is_sensitive` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` CHAR(36)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Email Templates Table
CREATE TABLE IF NOT EXISTS `email_templates` (
    `id` CHAR(36) PRIMARY KEY,
    `name` VARCHAR(100) UNIQUE NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `html_content` TEXT NOT NULL,
    `text_content` TEXT,
    `variables` JSON,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` CHAR(36)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Email Queue Table
CREATE TABLE IF NOT EXISTS `email_queue` (
    `id` CHAR(36) PRIMARY KEY,
    `to_email` VARCHAR(255) NOT NULL,
    `from_email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `html_content` TEXT NOT NULL,
    `text_content` TEXT,
    `template_id` CHAR(36),
    `waitlist_entry_id` CHAR(36),
    `status` VARCHAR(20) DEFAULT 'pending',
    `attempts` INT DEFAULT 0,
    `max_attempts` INT DEFAULT 3,
    `scheduled_at` TIMESTAMP NULL,
    `sent_at` TIMESTAMP NULL,
    `error_message` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Analytics Events Table
CREATE TABLE IF NOT EXISTS `analytics_events` (
    `id` CHAR(36) PRIMARY KEY,
    `event_type` VARCHAR(50) NOT NULL,
    `event_data` JSON,
    `user_id` VARCHAR(255),
    `waitlist_entry_id` CHAR(36),
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `referrer` TEXT,
    `page_url` TEXT,
    `utm_source` VARCHAR(100),
    `utm_medium` VARCHAR(100),
    `utm_campaign` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Admin Activity Log Table
CREATE TABLE IF NOT EXISTS `admin_activity_log` (
    `id` CHAR(36) PRIMARY KEY,
    `user_id` CHAR(36) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `resource_type` VARCHAR(50),
    `resource_id` CHAR(36),
    `old_values` JSON,
    `new_values` JSON,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
