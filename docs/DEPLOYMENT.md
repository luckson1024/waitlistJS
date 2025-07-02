# Deployment Guide (InfinityFree + Laravel + React)

## Overview

This guide explains how to deploy the Myzuwa Waitlist Platform using a Laravel PHP backend and a React static frontend on InfinityFree or similar PHP/MySQL hosts. All features, including Gemini AI, confirmation email, logo upload, and admin extensibility, are supported. The database schema is provided in `database/myzuwa_schema.sql`.

---

## 1. Prepare the Frontend (React)

- Build the frontend:
  ```bash
  npm run build
  ```
- Upload the contents of the `dist/` folder to your InfinityFree `htdocs` or `public_html` directory (or a subfolder if desired).

## 2. Prepare the Backend (Laravel)

- Create a new Laravel project locally:
  ```bash
  composer create-project laravel/laravel backend-laravel
  ```
- Copy your backend code into this project.
- Configure `.env` for your InfinityFree MySQL database credentials and SSL options if available.
- Run migrations:
  ```bash
  php artisan migrate
  ```
- Upload the Laravel project (except `node_modules`, `vendor`, `.env`) to your InfinityFree `htdocs` or `public_html` directory.
- On the server, run:
  ```bash
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate
  ```
- Set correct permissions for `storage` and `bootstrap/cache`.

## 3. MySQL Database

- Create a MySQL database in the InfinityFree control panel.
- Import the schema from `database/myzuwa_schema.sql` using phpMyAdmin.
- Update `.env` in Laravel with your DB credentials and SSL options if available.

## 4. .htaccess and Routing

- Use Laravel's default `.htaccess` for backend routing.
- For SPA frontend, add rewrite rules to serve `index.html` for all non-API routes.

## 5. SSL

- Use InfinityFree's free SSL certificates for HTTPS.
- If your host supports MySQL SSL, set `MYSQL_ATTR_SSL_CA`, `MYSQL_ATTR_SSL_CERT`, and `MYSQL_ATTR_SSL_KEY` in `.env`.

## 6. Environment Variables

- Set all sensitive config in `.env` (DB, mail, Gemini API key, etc.).

## 7. Testing

- Test all endpoints and frontend routes after deployment.
- Test Gemini AI, confirmation email, logo upload, and admin panel features.

---

For more details on the schema, see `DATABASE.md` and `database/myzuwa_schema.sql`.