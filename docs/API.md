# API Documentation

## Overview

The Myzuwa Waitlist Platform API provides RESTful endpoints for managing waitlist entries, content, settings, and analytics. This document covers all available endpoints, authentication, and integration details.

## Base URL

```
Production: https://api.myzuwa.com/v1
Development: http://localhost:3001/api/v1
```

## Authentication

### Admin Authentication
The API uses JWT (JSON Web Tokens) for admin authentication.

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@myzuwa.com",
      "role": "admin"
    },
    "expiresIn": "24h"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

#### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <token>
```

### API Key Authentication (Optional)
For server-to-server communication:

```http
GET /api/v1/waitlist
X-API-Key: your_api_key
```

## Waitlist Endpoints

### Create Waitlist Entry
```http
POST /waitlist
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "typeOfBusiness": "Music Production",
  "customBusinessTypes": "",
  "country": "United States",
  "city": "New York",
  "hasRunStoreBefore": false,
  "wantsTutorialBook": true,
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "launch"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "position": 1234,
    "estimatedWaitTime": "2-3 weeks",
    "emailVerificationRequired": true
  },
  "message": "Successfully joined the waitlist!"
}
```

### Get Waitlist Entries (Admin)
```http
GET /admin/waitlist?page=1&limit=50&search=john&country=US&businessType=Music
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50, max: 100)
- `search` (string): Search in name or email
- `country` (string): Filter by country
- `businessType` (string): Filter by business type
- `hasStore` (boolean): Filter by store experience
- `wantsTutorial` (boolean): Filter by tutorial interest
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "phoneNumber": "+1234567890",
        "typeOfBusiness": "Music Production",
        "country": "United States",
        "city": "New York",
        "hasRunStoreBefore": false,
        "wantsTutorialBook": true,
        "emailVerified": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1234,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Waitlist Statistics (Admin)
```http
GET /admin/waitlist/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1234,
    "verified": 1100,
    "unverified": 134,
    "withStoreExperience": 456,
    "wantsTutorial": 789,
    "topCountries": [
      { "country": "United States", "count": 345 },
      { "country": "Canada", "count": 123 },
      { "country": "United Kingdom", "count": 98 }
    ],
    "businessTypeDistribution": [
      { "type": "Music Production", "count": 234 },
      { "type": "Fashion & Apparel", "count": 189 },
      { "type": "Digital Goods", "count": 156 }
    ],
    "signupTrends": [
      { "date": "2024-01-01", "count": 45 },
      { "date": "2024-01-02", "count": 67 },
      { "date": "2024-01-03", "count": 52 }
    ]
  }
}
```

### Export Waitlist Data (Admin)
```http
GET /admin/waitlist/export?format=csv&filters=...
Authorization: Bearer <token>
```

**Query Parameters:**
- `format` (string): csv, json, xlsx (default: csv)
- `filters` (string): JSON string of filters to apply

**Response:**
- CSV file download or JSON data

### Update Waitlist Entry (Admin)
```http
PUT /admin/waitlist/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active",
  "emailVerified": true,
  "notes": "VIP customer"
}
```

### Delete Waitlist Entry (Admin)
```http
DELETE /admin/waitlist/:id
Authorization: Bearer <token>
```

## Content Management Endpoints

### Get All Content (Admin)
```http
GET /admin/content
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "heroTitle": "Myzuwa\nis coming.",
    "heroSubtitle": "E-commerce meets music.",
    "emailFormTitle": "Join the waitlist",
    "successTitle": "Welcome to Myzuwa!",
    // ... all content fields
  }
}
```

### Update Content (Admin)
```http
PUT /admin/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "heroTitle": "New Hero Title",
  "heroSubtitle": "Updated subtitle",
  "emailFormTitle": "Join Our Community"
}
```

### Reset Content to Default (Admin)
```http
POST /admin/content/reset
Authorization: Bearer <token>
```

## Site Settings Endpoints

### Get All Settings (Admin)
```http
GET /admin/settings
Authorization: Bearer <token>
```

### Update Settings (Admin)
```http
PUT /admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "siteName": "MYZUWA",
  "metaTitle": "New Meta Title",
  "primaryColor": "#ea580c",
  "emailNotifications": {
    "newSignup": true,
    "dailyReport": false
  }
}
```

### Export Settings (Admin)
```http
GET /admin/settings/export
Authorization: Bearer <token>
```

### Import Settings (Admin)
```http
POST /admin/settings/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: settings.json
```

## Email Management Endpoints

### Send Test Email (Admin)
```http
POST /admin/email/test
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "test@example.com",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Email Templates (Admin)
```http
GET /admin/email/templates
Authorization: Bearer <token>
```

### Update Email Template (Admin)
```http
PUT /admin/email/templates/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Welcome to Myzuwa!",
  "htmlContent": "<html>...</html>",
  "textContent": "Welcome to Myzuwa..."
}
```

### Get Email Queue Status (Admin)
```http
GET /admin/email/queue?status=pending&limit=100
Authorization: Bearer <token>
```

## Analytics Endpoints

### Track Event
```http
POST /analytics/track
Content-Type: application/json

{
  "eventType": "page_view",
  "eventData": {
    "page": "/waitlist",
    "source": "organic"
  },
  "userId": "anonymous_user_id",
  "utmSource": "google",
  "utmMedium": "organic"
}
```

### Get Analytics Data (Admin)
```http
GET /admin/analytics?startDate=2024-01-01&endDate=2024-01-31&metric=signups
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)
- `metric` (string): signups, page_views, conversions, etc.
- `groupBy` (string): day, week, month
- `filters` (object): Additional filters

## File Upload Endpoints

### Upload Image (Admin)
```http
POST /admin/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: image.jpg
folder: logos
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.myzuwa.com/uploads/logos/image.jpg",
    "filename": "image.jpg",
    "size": 12345,
    "mimeType": "image/jpeg"
  }
}
```

## Webhook Endpoints

### Email Webhook (for email service providers)
```http
POST /webhooks/email
Content-Type: application/json
X-Webhook-Signature: signature

{
  "event": "delivered",
  "messageId": "uuid",
  "email": "user@example.com",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "uuid"
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

### Limits
- Public endpoints: 100 requests per hour per IP
- Admin endpoints: 1000 requests per hour per token
- File uploads: 10 uploads per hour per token

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Pagination

### Standard Pagination
```http
GET /admin/waitlist?page=2&limit=25
```

### Cursor-based Pagination (for large datasets)
```http
GET /admin/analytics/events?cursor=eyJpZCI6InV1aWQifQ&limit=100
```

## Filtering and Sorting

### Query Syntax
```http
GET /admin/waitlist?filter[country]=US&filter[hasStore]=true&sort=-createdAt
```

### Advanced Filtering
```http
GET /admin/waitlist?q={"country":{"$in":["US","CA"]},"createdAt":{"$gte":"2024-01-01"}}
```

## Webhooks Configuration

### Setting up Webhooks (Admin)
```http
POST /admin/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["waitlist.created", "email.delivered"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events
- `waitlist.created`: New waitlist entry
- `waitlist.updated`: Waitlist entry modified
- `email.sent`: Email successfully sent
- `email.delivered`: Email delivered
- `email.bounced`: Email bounced
- `email.opened`: Email opened (if tracking enabled)

## SDK and Libraries

### JavaScript/Node.js
```bash
npm install @myzuwa/api-client
```

```javascript
import { MyzuwaClient } from '@myzuwa/api-client';

const client = new MyzuwaClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.myzuwa.com/v1'
});

// Add to waitlist
const result = await client.waitlist.create({
  email: 'user@example.com',
  fullName: 'John Doe',
  // ... other fields
});
```

### Python
```bash
pip install myzuwa-python
```

```python
from myzuwa import MyzuwaClient

client = MyzuwaClient(api_key='your_api_key')

# Add to waitlist
result = client.waitlist.create(
    email='user@example.com',
    full_name='John Doe',
    # ... other fields
)
```

## Testing

### Test Environment
```
Base URL: https://api-staging.myzuwa.com/v1
Test API Key: test_key_123456789
```

### Postman Collection
Download the complete Postman collection: [Myzuwa API Collection](./postman/myzuwa-api.json)

### Example Requests

#### cURL Examples
```bash
# Create waitlist entry
curl -X POST https://api.myzuwa.com/v1/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "phoneNumber": "+1234567890",
    "typeOfBusiness": "Music Production",
    "country": "United States",
    "city": "New York",
    "hasRunStoreBefore": false,
    "wantsTutorialBook": true
  }'

# Get waitlist stats (admin)
curl -X GET https://api.myzuwa.com/v1/admin/waitlist/stats \
  -H "Authorization: Bearer your_jwt_token"
```

## Monitoring and Observability

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "email": "healthy"
  }
}
```

### Metrics Endpoint
```http
GET /metrics
```

Returns Prometheus-compatible metrics for monitoring.

## Security

### HTTPS Only
All API endpoints require HTTPS in production.

### CORS Configuration
```javascript
// Allowed origins
const allowedOrigins = [
  'https://myzuwa.com',
  'https://admin.myzuwa.com',
  'http://localhost:3000' // Development only
];
```

### Input Validation
All inputs are validated using JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255
    },
    "fullName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 255
    }
  },
  "required": ["email", "fullName"]
}
```

### Data Sanitization
- HTML content is sanitized to prevent XSS
- SQL injection prevention through parameterized queries
- Input length limits enforced
- File upload restrictions (type, size)

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Waitlist management endpoints
- Admin authentication
- Content management system
- Basic analytics tracking

### v1.1.0 (Planned)
- Advanced analytics endpoints
- Webhook system
- Email template management
- Bulk operations support