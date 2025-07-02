# System Architecture Documentation

## Overview

The Myzuwa Waitlist Platform is fully compatible with InfinityFree and similar PHP/MySQL hosts. The architecture uses a React static frontend and a Laravel PHP backend with a MySQL database. All features, including Gemini AI, confirmation email, logo upload, and admin extensibility, are supported. The database schema is defined in `database/myzuwa_schema.sql` and documented in `DATABASE.md`.

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: User interface and user experience (React, Vite, static hosting)
- **Backend**: Business logic and API services (Laravel PHP)
- **Database**: Data persistence and integrity (MySQL, see `myzuwa_schema.sql`)
- **Cache**: (Optional, e.g., Laravel cache, but Redis not required for InfinityFree)
- **Storage**: File and asset management (public folder, S3 optional)

### 2. Scalability
- Horizontal scaling via stateless frontend and backend
- Database optimization for growth (MySQL indexes)
- CDN integration for global performance (InfinityFree supports static assets)

### 3. Security
- Authentication and authorization (Laravel Auth)
- Data encryption and protection (Laravel best practices)
- Input validation and sanitization (Laravel validation)
- Rate limiting and abuse prevention (Laravel middleware)
- AI-powered security agent (Gemini) for admin panel
- SSL support for MySQL and frontend

### 4. Maintainability
- Clean code principles
- Comprehensive testing (Laravel tests, React tests)
- Documentation and monitoring
- Version control and CI/CD (GitHub Actions, etc.)

## System Overview

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, SPA, static hosting
- **Backend:** Laravel PHP, Eloquent ORM, REST API, MySQL 8.0+
- **Database:** See `myzuwa_schema.sql` and `DATABASE.md` for full schema
- **AI:** Gemini API integration for admin security agent
- **Email:** Laravel Mail for confirmation and notifications
- **Admin:** Full dashboard for content, settings, analytics, Gemini, and more

## Database Architecture

- See `DATABASE.md` and `database/myzuwa_schema.sql` for the latest schema (SQL format)
- All migrations and schema changes should be made via Laravel migrations and kept in sync with the SQL file

## Deployment
- **Frontend:** Deploy static build (`dist/`) to InfinityFree
- **Backend:** Deploy Laravel app to InfinityFree (public_html)
- **.htaccess:** Use for SPA routing and API proxying if needed
- **SSL:** Use InfinityFree's free SSL certificates for HTTPS and MySQL SSL options in `.env`

## Testing
- Use Laravel's built-in testing tools for backend
- Use React Testing Library/Jest for frontend
- Test each phase after implementation

---

This architecture is now fully compatible with InfinityFree and similar PHP/MySQL hosts, and supports all new features including Gemini AI, confirmation email, logo upload, and admin extensibility.