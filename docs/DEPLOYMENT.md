# Deployment Guide (InfinityFree + Laravel + React)

## Overview

This guide explains how to deploy the Myzuwa Waitlist Platform using a Laravel PHP backend and a React static frontend on InfinityFree or similar PHP/MySQL hosts.

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
- Configure `.env` for your InfinityFree MySQL database credentials.
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
- Update `.env` in Laravel with your DB credentials.

## 4. .htaccess and Routing

- Use Laravel's default `.htaccess` for backend routing.
- For SPA frontend, add rewrite rules to serve `index.html` for all non-API routes.

## 5. SSL

- Use InfinityFree's free SSL certificates for HTTPS.

## 6. Environment Variables

- Set all sensitive config in `.env` (DB, mail, etc.).

## 7. Testing

- Test all endpoints and frontend routes after deployment.

---

See `ToDo.md` for phased implementation and testing checklist.