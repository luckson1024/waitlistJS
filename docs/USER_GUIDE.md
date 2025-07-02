# User Guide (Myzuwa Waitlist Platform)

## Overview
This guide explains how to use the Myzuwa Waitlist Platform, now powered by a React frontend and a Laravel PHP backend on InfinityFree. The platform supports waitlist registration, confirmation emails, and a modern, mobile-friendly admin panel with AI-powered security features. The database is managed via phpMyAdmin using the schema in `database/myzuwa_schema.sql`.

---

## For Users (Waitlist Signup)
1. Visit the main site and enter your email in the waitlist form.
2. Your email is saved immediately (even if you don't finish the form).
3. Complete the rest of the form to join the waitlist.
4. You will see a success message and receive a confirmation email (customizable by the admin).
5. Social media links and a custom heading may be shown on the success page.

## For Admins
1. Go to `/admin` and log in with your admin credentials.
2. View, filter, and export waitlist entries (CSV export available).
3. Edit site content, logo, social media links, and settings from the admin dashboard.
4. Manage Gemini API key and model for the AI Security Agent in Site Settings.
5. Use the AI Security Agent tab to chat with Gemini for security and compliance advice.
6. Edit the confirmation email message sent to users after registration.
7. All changes are saved in real time and reflected on the frontend.
8. The database schema is managed via `database/myzuwa_schema.sql` and phpMyAdmin.

## Platform Features
- Mobile-friendly design
- Secure authentication (Laravel Auth)
- Real-time validation
- Data export (CSV)
- Content and settings management
- Logo upload and social media integration
- Confirmation email on registration
- Gemini-powered AI Security Agent for admins
- Admin extensibility and full documentation

## Troubleshooting
- If you have issues, contact support or check the FAQ.
- For deployment or admin issues, see `DEVELOPER_GUIDE.md` and `DEPLOYMENT.md`.
- For API or integration issues, see `API.md`.
- For database issues, see `DATABASE.md` and `database/myzuwa_schema.sql`.

---

Enjoy using Myzuwa on InfinityFree or your own PHP/MySQL host!