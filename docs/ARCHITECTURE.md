# System Architecture Documentation

## Overview

The Myzuwa Waitlist Platform is being transformed for compatibility with InfinityFree and similar PHP/MySQL hosts. The new architecture uses a React static frontend and a Laravel PHP backend with a MySQL database. This document outlines the updated system architecture, design patterns, and technical decisions.

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: User interface and user experience (React, Vite, static hosting)
- **Backend**: Business logic and API services (Laravel PHP)
- **Database**: Data persistence and integrity (MySQL)
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

### 4. Maintainability
- Clean code principles
- Comprehensive testing (Laravel tests, React tests)
- Documentation and monitoring
- Version control and CI/CD (GitHub Actions, etc.)

## System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
        C[Admin Panel]
    end
    subgraph "CDN/Load Balancer"
        D[InfinityFree/CDN]
    end
    subgraph "Application Layer"
        E[React Frontend (Static)]
        F[Laravel PHP Backend API]
        G[Admin Dashboard]
    end
    subgraph "Service Layer"
        H[Authentication Service (Laravel)]
        I[Email Service (Laravel)]
        J[Analytics Service (Laravel)]
        K[File Upload Service (Laravel)]
    end
    subgraph "Data Layer"
        L[MySQL Database]
        N[File Storage (public/S3)]
    end
    subgraph "External Services"
        O[Email Provider]
        P[Analytics Provider]
        Q[Monitoring Service]
    end
    A --> D
    B --> D
    C --> D
    D --> E
    D --> G
    E --> F
    G --> F
    F --> H
    F --> I
    F --> J
    F --> K
    H --> L
    I --> L
    J --> L
    K --> N
    I --> O
    J --> P
    F --> Q
```

## Frontend Architecture

### Technology Stack
- **React 18**: Component-based UI framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Context API**: State management

### Component Architecture

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── forms/               # Form-specific components
│   │   ├── EmailCapture.tsx
│   │   ├── WaitlistForm.tsx
│   │   └── FormField.tsx
│   ├── admin/               # Admin panel components
│   │   ├── Dashboard.tsx
│   │   ├── Sidebar.tsx
│   │   ├── DataTable.tsx
│   │   └── ContentEditor.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── contexts/                # React contexts
│   ├── ContentContext.tsx
│   ├── SettingsContext.tsx
│   └── AuthContext.tsx
├── hooks/                   # Custom React hooks
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── services/                # API service functions
│   ├── api.ts
│   ├── waitlistService.ts
│   └── authService.ts
├── types/                   # TypeScript definitions
│   ├── waitlist.ts
│   ├── content.ts
│   └── settings.ts
└── utils/                   # Utility functions
    ├── validation.ts
    ├── formatting.ts
    └── constants.ts
```

### State Management Strategy

#### Context API Usage
```typescript
// Global state management using React Context
interface AppState {
  user: User | null;
  content: SiteContent;
  settings: SiteSettings;
  waitlistData: WaitlistEntry[];
}

// Context providers wrap the application
<AuthProvider>
  <SettingsProvider>
    <ContentProvider>
      <App />
    </ContentProvider>
  </SettingsProvider>
</AuthProvider>
```

#### Local State Management
- Component-level state for UI interactions
- Form state management with controlled components
- Temporary data and loading states

### Routing Architecture

```typescript
// Route structure
const routes = [
  {
    path: '/',
    element: <WaitlistFlow />,
    children: [
      { index: true, element: <EmailCapture /> },
      { path: 'details', element: <WaitlistForm /> },
      { path: 'success', element: <SuccessMessage /> }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'waitlist', element: <WaitlistManagement /> },
      { path: 'content/*', element: <ContentEditor /> },
      { path: 'settings', element: <SiteSettings /> }
    ]
  }
];
```

## Backend Architecture

### Technology Stack
- **Laravel 11+ (PHP 8.3+)**: Web application framework
- **MySQL 8.0+**: Relational database
- **JWT or Laravel Auth**: Authentication tokens
- **bcrypt**: Password hashing (Laravel default)
- **Laravel Queues**: Job queues (for email, etc.)
- **Laravel Mail**: Email sending
- **Laravel Validation**: Input validation
- **Laravel Middleware**: Security, rate limiting, etc.

### Layered Architecture

```
backend-laravel/
├── app/
│   ├── Http/Controllers/         # Request handlers
│   ├── Models/                   # Eloquent models
│   ├── Services/                 # Business logic
│   ├── Policies/                 # Authorization
│   ├── Requests/                 # Validation
│   └── ...
├── database/
│   ├── migrations/               # MySQL migrations
│   └── seeders/                  # Database seeders
├── routes/
│   ├── api.php                   # API routes
│   └── web.php                   # Web routes
├── tests/                        # Test files
└── ...
```

### API Design Patterns

#### RESTful API Structure (Laravel routes/api.php)
```
POST   /api/v1/waitlist/email-capture   # Save email on first step
PUT    /api/v1/waitlist/:id             # Update waitlist entry with details
GET    /api/v1/waitlist                 # Get waitlist entries (admin)
POST   /api/v1/auth/login               # Admin login
POST   /api/v1/admin/content            # Update content
GET    /api/v1/admin/settings           # Get settings
PUT    /api/v1/admin/settings           # Update settings
```

#### Request/Response Format
```typescript
// Standard API response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationInfo;
    timestamp: string;
    requestId: string;
  };
}

// Pagination format
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### Service Layer Architecture
- Use Laravel Service classes for business logic
- Use Eloquent models for data access
- Use Laravel validation for all input
- Use Laravel events/queues for async tasks (emails, analytics)

## Database Architecture

### Schema Design
- See `DATABASE.md` for MySQL-compatible schema (Laravel migration format)

## Deployment
- **Frontend**: Deploy static build (`dist/`) to InfinityFree
- **Backend**: Deploy Laravel app to InfinityFree (public_html)
- **.htaccess**: Use for SPA routing and API proxying if needed
- **SSL**: Use InfinityFree's free SSL certificates

## Testing
- Use Laravel's built-in testing tools for backend
- Use React Testing Library/Jest for frontend
- Test each phase after implementation

---

This architecture is now fully compatible with InfinityFree and similar PHP/MySQL hosts.