# API Documentation (Laravel + MySQL)

## Overview

The API is powered by Laravel PHP and MySQL, designed for compatibility with InfinityFree and similar hosts. It supports all waitlist, admin, content, settings, AI, and email features. The database schema is defined in `database/myzuwa_schema.sql`.

## Base URL

```
https://your-infinityfree-domain/api/v1/
```

## Authentication

- Admin endpoints use JWT or Laravel session authentication.
- Use `/api/v1/auth/login` to obtain a token.

## Endpoints

### Waitlist

- `POST /waitlist/email-capture` — Save email on first step (partial entry)
- `PUT /waitlist/{id}` — Update waitlist entry with details
- `GET /waitlist` — List waitlist entries (admin)
- `GET /waitlist/{id}` — Get single entry (admin)
- `DELETE /waitlist/{id}` — Delete entry (admin)
- `POST /waitlist/bulk-delete` — Bulk delete entries (admin)

### Admin

- `POST /auth/login` — Admin login
- `POST /admin/content` — Update frontend content
- `GET /admin/settings` — Get site settings
- `PUT /admin/settings` — Update site settings (including Gemini API key, Gemini models, confirmation email message, logo, social links)
- `GET /admin/stats` — Get statistics
- `GET /admin/export` — Export waitlist data (CSV)
- `POST /admin/upload-logo` — Upload site logo

### Content & Settings

- `GET /content` — Get all frontend content
- `GET /settings` — Get all site settings

### AI Security Agent

- `POST /ai/security` — Chat with Gemini-powered security agent (requires Gemini API key in settings)

### Email

- Confirmation emails are sent on waitlist registration using the customizable message in settings.
- `GET /admin/email-template` — Get confirmation email template/message
- `PUT /admin/email-template` — Update confirmation email template/message

## Request/Response Format

All responses use:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## Notes
- See `DATABASE.md` and `database/myzuwa_schema.sql` for schema details.
- All endpoints are extensible for future admin features.
- Gemini AI integration is available for admin security and compliance.

## Example: Email Capture

**POST** `/api/v1/waitlist/email-capture`

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": { "id": "uuid", "email": "user@example.com" }
}
```

## Example: Update Waitlist Entry

**PUT** `/api/v1/waitlist/{id}`

```json
{
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  ...
}
```

## Error Format

```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] }
}
```

---

See `DEVELOPER_GUIDE.md` for more details on request validation, authentication, and new features (Gemini, confirmation email, logo upload, etc.).