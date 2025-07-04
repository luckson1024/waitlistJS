# AI Agent System Instructions (React + Laravel + InfinityFree)

## Purpose
These instructions are for an AI agent (or developer) to maintain, extend, or migrate the Myzuwa Waitlist Platform using a React frontend and a Laravel PHP backend, ensuring full compatibility with InfinityFree or similar shared PHP/MySQL hosting. All features must be preserved, including Gemini AI, confirmation email, logo upload, and admin extensibility. The database schema is defined in `database/myzuwa_schema.sql` and documented in `DATABASE.md`.

---

## 1. General Principles
- **Frontend:** Use React (TypeScript, Vite, Tailwind CSS) for all UI/UX. Build as static files for deployment.
- **Backend:** Use Laravel PHP for all API, admin, and business logic. No Node.js/Express backend.
- **Database:** Use MySQL 8.0+ (or MariaDB 10.6+) for all data storage. See `myzuwa_schema.sql` for table definitions.
- **Hosting:** Deploy static frontend and Laravel backend to InfinityFree or similar PHP host.
- **No Feature Loss:** All features from the original system (multi-step waitlist, admin panel, analytics, content management, Gemini AI, confirmation email, logo upload, social media, etc.) must be preserved.

## 2. React Frontend Instructions
- All user and admin interfaces must be implemented in React.
- Use React Router for navigation (SPA approach).
- Use Context API for global state (content, settings, auth, etc.).
- Use controlled components for all forms.
- On waitlist form, POST email to `/api/v1/waitlist/email-capture` as soon as user submits the first step.
- On form completion, PUT details to `/api/v1/waitlist/{id}`.
- All API calls must point to the deployed Laravel backend (not Node.js).
- Build frontend with `npm run build` and upload `dist/` to InfinityFree.
- Admin panel must support Gemini AI agent, Gemini settings, confirmation email management, logo upload, and social media management.

## 3. Laravel Backend Instructions
- All API endpoints must be implemented in Laravel (see `API.md`).
- Use Laravel migrations for all schema changes (see `DATABASE.md` and `myzuwa_schema.sql`).
- Use Eloquent models for all data access.
- Use Laravel validation for all input.
- Use Laravel Auth for admin authentication.
- Implement partial email capture and full waitlist update endpoints.
- Implement admin panel endpoints for content, settings, analytics, export, Gemini AI, confirmation email, logo upload, and social media.
- Use Laravel Mail for email features.
- Use Laravel queues for async jobs if needed (optional on InfinityFree).
- Store Gemini API key and models in settings table (encrypted if possible).
- Store confirmation email message in settings table and use for all confirmation emails.

## 4. Deployment & Hosting
- Only static files and PHP (Laravel) are supported on InfinityFree.
- No Node.js/Express backend is allowed.
- Use `.htaccess` for SPA routing and API proxying if needed.
- Use InfinityFree's SSL and MySQL features.

## 5. Testing & QA
- Test all features after each change (see `ToDo.md` for phased plan).
- Use Laravel's built-in tests for backend and React Testing Library/Jest for frontend.
- Ensure all user/admin flows, validation, exports, Gemini AI, confirmation email, logo upload, and social media work as expected.

## 6. Documentation
- Keep all docs in `docs/` up to date with any changes.
- Update `ToDo.md` as tasks are completed.
- Reference `DATABASE.md` and `myzuwa_schema.sql` for schema changes.

---

**Summary:**
- Use React for all UI, Laravel for all backend/API, MySQL for data, and deploy to InfinityFree.
- Never remove or degrade any feature from the original system.
- Always test after each phase and update documentation accordingly.
- Ensure Gemini AI, confirmation email, logo upload, and admin extensibility are always supported.
- Keep the schema in sync with `myzuwa_schema.sql` and document all changes.
