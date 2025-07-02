# Developer Guide (Laravel + MySQL + React)

## Overview

This guide provides comprehensive information for developers working on the Myzuwa Waitlist Platform with a Laravel PHP backend, MySQL database, and React frontend. It covers architecture, setup, development workflows, and best practices for InfinityFree or similar shared PHP hosting. All features, including AI agent, Gemini API, confirmation email, logo upload, and social media integration, are documented. The database schema is provided in `database/myzuwa_schema.sql`.

---

## 1. Prerequisites

```bash
# Required software
- PHP 8.3+ and Composer (for backend API)
- Node.js 18+ (for building React frontend only; not for backend/API)
- MySQL 8.0+
- Git
```

> **Note:** InfinityFree and similar shared PHP hosts do NOT support Node.js for backend or API. All backend logic must be implemented in PHP (Laravel). Node.js is only used locally to build the React frontend, which is then uploaded as static files.

## 2. Local Development Setup

### Backend (Laravel)

1. **Clone the repo and navigate to the backend folder:**

```bash
git clone https://github.com/yourusername/myzuwa-waitlist.git
cd myzuwa-waitlist/backend-laravel
```

2. **Install PHP dependencies:**

```bash
composer install
```

3. **Copy the environment file and generate the application key:**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Set up the database:**

- Create a new MySQL database.
- Import the schema from `database/myzuwa_schema.sql` using phpMyAdmin.
- Update the `.env` file with your database credentials and SSL options if available.
- Run the migrations and seed the database (optional):

```bash
php artisan migrate
php artisan db:seed
```

5. **Start the Laravel development server:**

```bash
php artisan serve
```

---

## 3. Frontend (React)

- See `README.md` for frontend setup and build instructions.

---

## 4. Security & Best Practices

- Use strong, unique passwords for DB users.
- Never commit `.env` to version control.
- Use SSL for MySQL if your host supports it (see `.env` and `DEPLOYMENT.md`).
- Store sensitive settings (Gemini API key, etc.) securely in the database and `.env`.
- Use Laravel validation and policies for all input and admin actions.

---

## 5. Database Schema

- See `DATABASE.md` and `database/myzuwa_schema.sql` for the latest schema and table definitions.