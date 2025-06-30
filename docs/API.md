# API Documentation (Laravel + MySQL)

## Overview

The API is now powered by Laravel PHP and MySQL, designed for compatibility with InfinityFree and similar hosts.

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

### Admin

- `POST /auth/login` — Admin login
- `POST /admin/content` — Update frontend content
- `GET /admin/settings` — Get site settings
- `PUT /admin/settings` — Update site settings
- `GET /admin/stats` — Get statistics
- `GET /admin/export` — Export waitlist data (CSV)

### Content & Settings

- `GET /content` — Get all frontend content
- `GET /settings` — Get all site settings

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

See `DEVELOPER_GUIDE.md` for more details on request validation and authentication.