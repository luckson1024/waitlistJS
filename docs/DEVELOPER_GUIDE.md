# Developer Guide (Laravel + MySQL + React)

## Overview

This guide provides comprehensive information for developers working on the Myzuwa Waitlist Platform with a Laravel PHP backend, MySQL database, and React frontend. It covers architecture, setup, development workflows, and best practices for InfinityFree or similar shared PHP hosting.

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
- Update the `.env` file with your database credentials.
- Run the migrations and seed the database (optional):

```bash
php artisan migrate
php artisan db:seed
```

5. **Start the Laravel development server:**

```bash
php artisan serve
```

### Frontend (React)

1. **In a new terminal, navigate to the frontend folder:**

```bash
cd frontend
```

2. **Install JavaScript dependencies:**

```bash
npm install
```

3. **Start the React development server (for local development only):**

```bash
npm run dev
```

4. **Build the frontend for production (to upload to InfinityFree):**

```bash
npm run build
```
- Upload the contents of the `dist/` folder to your InfinityFree `htdocs` or `public_html` directory.

## 3. API Integration

- The React frontend communicates with the Laravel backend via REST API endpoints.
- Update API URLs in the frontend as needed (see `API.md` for available endpoints).
- The backend API must be deployed as a Laravel PHP app on InfinityFree or a compatible PHP host.

## 4. Testing

- Use Laravel's built-in test tools for backend testing:

```bash
php artisan test
```

- Use React Testing Library and Jest for frontend testing:

```bash
npm test
```

## 5. Deployment

- See `DEPLOYMENT.md` for detailed deployment steps for InfinityFree or similar shared PHP hosting.

---

For more details, see the other docs in this folder.