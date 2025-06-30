# Developer Guide

## Overview

This guide provides comprehensive information for developers working on the Myzuwa Waitlist Platform. It covers architecture, setup, development workflows, and best practices.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Redis Cache   │    │   File Storage  │
│   Assets        │    │   (Sessions)    │    │   (Images/Docs) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling and responsive design
- **React Router** for client-side routing
- **Context API** for state management
- **Lucide React** for icons

#### Backend (Recommended)
- **Node.js 18+** with Express.js framework
- **TypeScript** for type safety
- **Prisma** or **TypeORM** for database ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Joi** or **Zod** for input validation
- **Winston** for logging
- **Bull** for job queues

#### Database
- **PostgreSQL 14+** (Primary)
- **Redis 6+** for caching and sessions
- **AWS S3** or **Cloudinary** for file storage

#### Infrastructure
- **Docker** for containerization
- **Nginx** for reverse proxy
- **PM2** for process management
- **GitHub Actions** for CI/CD

## Development Environment Setup

### Prerequisites

```bash
# Required software
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git
- Docker (optional but recommended)
```

### Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone https://github.com/yourusername/myzuwa-waitlist.git
cd myzuwa-waitlist

# Install frontend dependencies
npm install

# Install backend dependencies (if separate)
cd backend
npm install
cd ..
```

2. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

3. **Database Setup**
```bash
# Create database
createdb myzuwa_dev

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

4. **Start Development Servers**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (if separate)
cd backend && npm run dev

# Terminal 3: Redis (if not running as service)
redis-server
```

### Environment Variables

```bash
# .env file
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/myzuwa_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Email Service (choose one)
SENDGRID_API_KEY=your_sendgrid_key
MAILGUN_API_KEY=your_mailgun_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=myzuwa-uploads
AWS_REGION=us-east-1

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your_mixpanel_token

# External APIs
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
STRIPE_SECRET_KEY=sk_test_...

# Admin
ADMIN_EMAIL=admin@myzuwa.com
ADMIN_PASSWORD=secure_password_here
```

## Project Structure

```
myzuwa-waitlist/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── admin/               # Admin panel components
│   │   ├── common/              # Shared components
│   │   └── forms/               # Form components
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── services/                # API service functions
│   └── styles/                  # CSS and styling
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Backend utilities
│   │   └── validators/          # Input validation schemas
│   ├── migrations/              # Database migrations
│   ├── seeds/                   # Database seed files
│   └── tests/                   # Backend tests
├── docs/                        # Documentation
├── scripts/                     # Build and deployment scripts
├── docker/                      # Docker configuration
└── tests/                       # End-to-end tests
```

## Backend Implementation

### Express.js Server Setup

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

export default app;
```

### Database Models (Prisma Example)

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(uuid())
  username    String   @unique
  email       String   @unique
  passwordHash String  @map("password_hash")
  role        String   @default("admin")
  isActive    Boolean  @default(true) @map("is_active")
  lastLogin   DateTime? @map("last_login")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  activityLogs AdminActivityLog[]
  contentUpdates SiteContent[]
  settingsUpdates SiteSettings[]

  @@map("users")
}

model WaitlistEntry {
  id                    String   @id @default(uuid())
  email                 String   @unique
  fullName              String   @map("full_name")
  phoneNumber           String   @map("phone_number")
  typeOfBusiness        String   @map("type_of_business")
  customBusinessTypes   String?  @map("custom_business_types")
  country               String
  city                  String
  hasRunStoreBefore     Boolean  @default(false) @map("has_run_store_before")
  wantsTutorialBook     Boolean  @default(false) @map("wants_tutorial_book")
  ipAddress             String?  @map("ip_address")
  userAgent             String?  @map("user_agent")
  referrer              String?
  utmSource             String?  @map("utm_source")
  utmMedium             String?  @map("utm_medium")
  utmCampaign           String?  @map("utm_campaign")
  status                String   @default("active")
  emailVerified         Boolean  @default(false) @map("email_verified")
  emailVerificationToken String? @map("email_verification_token")
  emailVerificationSentAt DateTime? @map("email_verification_sent_at")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  // Relations
  emailQueue      EmailQueue[]
  analyticsEvents AnalyticsEvent[]

  @@map("waitlist_entries")
}

model SiteContent {
  id          String   @id @default(uuid())
  key         String   @unique
  value       String
  type        String   @default("text")
  category    String
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   String?  @map("updated_by")

  // Relations
  updatedByUser User? @relation(fields: [updatedBy], references: [id])

  @@map("site_content")
}

model SiteSettings {
  id          String   @id @default(uuid())
  key         String   @unique
  value       String
  type        String   @default("text")
  category    String
  description String?
  isSensitive Boolean  @default(false) @map("is_sensitive")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   String?  @map("updated_by")

  // Relations
  updatedByUser User? @relation(fields: [updatedBy], references: [id])

  @@map("site_settings")
}

model EmailQueue {
  id                String    @id @default(uuid())
  toEmail           String    @map("to_email")
  fromEmail         String    @map("from_email")
  subject           String
  htmlContent       String    @map("html_content")
  textContent       String?   @map("text_content")
  templateId        String?   @map("template_id")
  waitlistEntryId   String?   @map("waitlist_entry_id")
  status            String    @default("pending")
  attempts          Int       @default(0)
  maxAttempts       Int       @default(3) @map("max_attempts")
  scheduledAt       DateTime  @default(now()) @map("scheduled_at")
  sentAt            DateTime? @map("sent_at")
  errorMessage      String?   @map("error_message")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  waitlistEntry WaitlistEntry? @relation(fields: [waitlistEntryId], references: [id])
  template      EmailTemplate? @relation(fields: [templateId], references: [id])

  @@map("email_queue")
}

model EmailTemplate {
  id           String   @id @default(uuid())
  name         String   @unique
  subject      String
  htmlContent  String   @map("html_content")
  textContent  String?  @map("text_content")
  variables    Json?
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  updatedBy    String?  @map("updated_by")

  // Relations
  updatedByUser User? @relation(fields: [updatedBy], references: [id])
  emailQueue    EmailQueue[]

  @@map("email_templates")
}

model AnalyticsEvent {
  id                String    @id @default(uuid())
  eventType         String    @map("event_type")
  eventData         Json?     @map("event_data")
  userId            String?   @map("user_id")
  waitlistEntryId   String?   @map("waitlist_entry_id")
  ipAddress         String?   @map("ip_address")
  userAgent         String?   @map("user_agent")
  referrer          String?
  pageUrl           String?   @map("page_url")
  utmSource         String?   @map("utm_source")
  utmMedium         String?   @map("utm_medium")
  utmCampaign       String?   @map("utm_campaign")
  createdAt         DateTime  @default(now()) @map("created_at")

  // Relations
  waitlistEntry WaitlistEntry? @relation(fields: [waitlistEntryId], references: [id])

  @@map("analytics_events")
}

model AdminActivityLog {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  action       String
  resourceType String?  @map("resource_type")
  resourceId   String?  @map("resource_id")
  oldValues    Json?    @map("old_values")
  newValues    Json?    @map("new_values")
  ipAddress    String?  @map("ip_address")
  userAgent    String?  @map("user_agent")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@map("admin_activity_log")
}
```

### API Controllers

```typescript
// backend/src/controllers/waitlistController.ts
import { Request, Response, NextFunction } from 'express';
import { WaitlistService } from '../services/waitlistService';
import { EmailService } from '../services/emailService';
import { AnalyticsService } from '../services/analyticsService';
import { validateWaitlistEntry } from '../validators/waitlistValidator';

export class WaitlistController {
  private waitlistService: WaitlistService;
  private emailService: EmailService;
  private analyticsService: AnalyticsService;

  constructor() {
    this.waitlistService = new WaitlistService();
    this.emailService = new EmailService();
    this.analyticsService = new AnalyticsService();
  }

  async createEntry(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const { error, value } = validateWaitlistEntry(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.details[0].message,
            details: error.details
          }
        });
      }

      // Check for duplicate email
      const existingEntry = await this.waitlistService.findByEmail(value.email);
      if (existingEntry) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'Email already registered'
          }
        });
      }

      // Create waitlist entry
      const entry = await this.waitlistService.create({
        ...value,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      });

      // Track analytics event
      await this.analyticsService.track({
        eventType: 'waitlist_signup',
        eventData: {
          country: entry.country,
          businessType: entry.typeOfBusiness,
          hasStoreExperience: entry.hasRunStoreBefore
        },
        waitlistEntryId: entry.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Queue welcome email
      await this.emailService.queueWelcomeEmail(entry);

      // Get position in waitlist
      const position = await this.waitlistService.getPosition(entry.id);

      res.status(201).json({
        success: true,
        data: {
          id: entry.id,
          email: entry.email,
          position,
          estimatedWaitTime: this.calculateWaitTime(position),
          emailVerificationRequired: true
        },
        message: 'Successfully joined the waitlist!'
      });

    } catch (error) {
      next(error);
    }
  }

  async getEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 50,
        search,
        country,
        businessType,
        hasStore,
        wantsTutorial,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        search: search as string,
        country: country as string,
        businessType: businessType as string,
        hasStore: hasStore === 'true' ? true : hasStore === 'false' ? false : undefined,
        wantsTutorial: wantsTutorial === 'true' ? true : wantsTutorial === 'false' ? false : undefined
      };

      const result = await this.waitlistService.findMany({
        page: Number(page),
        limit: Math.min(Number(limit), 100),
        filters,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.waitlistService.getStatistics();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      next(error);
    }
  }

  async exportData(req: Request, res: Response, next: NextFunction) {
    try {
      const { format = 'csv', filters } = req.query;
      
      const data = await this.waitlistService.exportData({
        format: format as string,
        filters: filters ? JSON.parse(filters as string) : {}
      });

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=waitlist-${Date.now()}.csv`);
        res.send(data);
      } else {
        res.json({
          success: true,
          data
        });
      }

    } catch (error) {
      next(error);
    }
  }

  private calculateWaitTime(position: number): string {
    // Simple estimation logic
    if (position <= 100) return '1-2 weeks';
    if (position <= 500) return '2-4 weeks';
    if (position <= 1000) return '1-2 months';
    return '2-3 months';
  }
}
```

### Services Layer

```typescript
// backend/src/services/waitlistService.ts
import { PrismaClient } from '@prisma/client';
import { WaitlistEntry } from '../types/waitlist';

export class WaitlistService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Partial<WaitlistEntry>): Promise<WaitlistEntry> {
    return await this.prisma.waitlistEntry.create({
      data: data as any
    });
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    return await this.prisma.waitlistEntry.findUnique({
      where: { email }
    });
  }

  async findMany(options: {
    page: number;
    limit: number;
    filters: any;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { page, limit, filters, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.country) {
      where.country = filters.country;
    }

    if (filters.businessType) {
      where.typeOfBusiness = filters.businessType;
    }

    if (filters.hasStore !== undefined) {
      where.hasRunStoreBefore = filters.hasStore;
    }

    if (filters.wantsTutorial !== undefined) {
      where.wantsTutorialBook = filters.wantsTutorial;
    }

    // Get total count
    const total = await this.prisma.waitlistEntry.count({ where });

    // Get entries
    const entries = await this.prisma.waitlistEntry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    });

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  async getStatistics() {
    const [
      total,
      verified,
      withStoreExperience,
      wantsTutorial,
      topCountries,
      businessTypeDistribution,
      signupTrends
    ] = await Promise.all([
      this.prisma.waitlistEntry.count(),
      this.prisma.waitlistEntry.count({ where: { emailVerified: true } }),
      this.prisma.waitlistEntry.count({ where: { hasRunStoreBefore: true } }),
      this.prisma.waitlistEntry.count({ where: { wantsTutorialBook: true } }),
      this.getTopCountries(),
      this.getBusinessTypeDistribution(),
      this.getSignupTrends()
    ]);

    return {
      total,
      verified,
      unverified: total - verified,
      withStoreExperience,
      wantsTutorial,
      topCountries,
      businessTypeDistribution,
      signupTrends
    };
  }

  async getPosition(entryId: string): Promise<number> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: entryId }
    });

    if (!entry) throw new Error('Entry not found');

    const position = await this.prisma.waitlistEntry.count({
      where: {
        createdAt: { lt: entry.createdAt }
      }
    });

    return position + 1;
  }

  private async getTopCountries() {
    const result = await this.prisma.waitlistEntry.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5
    });

    return result.map(item => ({
      country: item.country,
      count: item._count.country
    }));
  }

  private async getBusinessTypeDistribution() {
    const result = await this.prisma.waitlistEntry.groupBy({
      by: ['typeOfBusiness'],
      _count: { typeOfBusiness: true },
      orderBy: { _count: { typeOfBusiness: 'desc' } }
    });

    return result.map(item => ({
      type: item.typeOfBusiness,
      count: item._count.typeOfBusiness
    }));
  }

  private async getSignupTrends() {
    // Get last 30 days of signups
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM waitlist_entries 
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return result;
  }

  async exportData(options: { format: string; filters: any }) {
    const { format, filters } = options;

    // Build where clause (similar to findMany)
    const where: any = {};
    // ... apply filters

    const entries = await this.prisma.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'csv') {
      return this.convertToCSV(entries);
    }

    return entries;
  }

  private convertToCSV(entries: WaitlistEntry[]): string {
    const headers = [
      'ID', 'Email', 'Full Name', 'Phone', 'Business Type',
      'Country', 'City', 'Has Store Experience', 'Wants Tutorial',
      'Created At'
    ];

    const rows = entries.map(entry => [
      entry.id,
      entry.email,
      entry.fullName,
      entry.phoneNumber,
      entry.typeOfBusiness,
      entry.country,
      entry.city,
      entry.hasRunStoreBefore ? 'Yes' : 'No',
      entry.wantsTutorialBook ? 'Yes' : 'No',
      entry.createdAt.toISOString()
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// backend/tests/services/waitlistService.test.ts
import { WaitlistService } from '../../src/services/waitlistService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('WaitlistService', () => {
  let service: WaitlistService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    service = new WaitlistService();
    (service as any).prisma = mockPrisma;
  });

  describe('create', () => {
    it('should create a new waitlist entry', async () => {
      const entryData = {
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+1234567890',
        typeOfBusiness: 'Music Production',
        country: 'United States',
        city: 'New York',
        hasRunStoreBefore: false,
        wantsTutorialBook: true
      };

      const expectedEntry = { id: 'uuid', ...entryData, createdAt: new Date() };
      mockPrisma.waitlistEntry.create.mockResolvedValue(expectedEntry as any);

      const result = await service.create(entryData);

      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: entryData
      });
      expect(result).toEqual(expectedEntry);
    });
  });

  describe('findByEmail', () => {
    it('should find entry by email', async () => {
      const email = 'test@example.com';
      const expectedEntry = { id: 'uuid', email, fullName: 'Test User' };
      
      mockPrisma.waitlistEntry.findUnique.mockResolvedValue(expectedEntry as any);

      const result = await service.findByEmail(email);

      expect(mockPrisma.waitlistEntry.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
      expect(result).toEqual(expectedEntry);
    });

    it('should return null if entry not found', async () => {
      mockPrisma.waitlistEntry.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
```

### Integration Tests

```typescript
// backend/tests/integration/waitlist.test.ts
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Waitlist API', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.waitlistEntry.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/waitlist', () => {
    it('should create a new waitlist entry', async () => {
      const entryData = {
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+1234567890',
        typeOfBusiness: 'Music Production',
        country: 'United States',
        city: 'New York',
        hasRunStoreBefore: false,
        wantsTutorialBook: true
      };

      const response = await request(app)
        .post('/api/v1/waitlist')
        .send(entryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(entryData.email);
      expect(response.body.data.position).toBe(1);

      // Verify in database
      const entry = await prisma.waitlistEntry.findUnique({
        where: { email: entryData.email }
      });
      expect(entry).toBeTruthy();
    });

    it('should return 409 for duplicate email', async () => {
      const entryData = {
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+1234567890',
        typeOfBusiness: 'Music Production',
        country: 'United States',
        city: 'New York',
        hasRunStoreBefore: false,
        wantsTutorialBook: true
      };

      // Create first entry
      await request(app)
        .post('/api/v1/waitlist')
        .send(entryData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/waitlist')
        .send(entryData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        fullName: '',
        phoneNumber: '123'
      };

      const response = await request(app)
        .post('/api/v1/waitlist')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### End-to-End Tests

```typescript
// tests/e2e/waitlist.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Waitlist Flow', () => {
  test('should complete full waitlist signup', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Fill email form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.click('[data-testid="email-submit"]');

    // Wait for form page
    await expect(page.locator('[data-testid="waitlist-form"]')).toBeVisible();

    // Fill personal information
    await page.fill('[data-testid="full-name"]', 'Test User');
    await page.fill('[data-testid="phone-number"]', '+1234567890');

    // Select business type
    await page.selectOption('[data-testid="business-type"]', 'Music Production');

    // Fill location
    await page.selectOption('[data-testid="country"]', 'United States');
    await page.fill('[data-testid="city"]', 'New York');

    // Check preferences
    await page.check('[data-testid="wants-tutorial"]');

    // Submit form
    await page.click('[data-testid="submit-form"]');

    // Verify success page
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=Welcome to Myzuwa!')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/');

    // Submit empty email
    await page.click('[data-testid="email-submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible();

    // Submit invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="email-submit"]');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });
});
```

## Deployment

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build frontend
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myzuwa
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=myzuwa
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/myzuwa
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart myzuwa
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_waitlist_created_at_desc ON waitlist_entries (created_at DESC);
CREATE INDEX CONCURRENTLY idx_waitlist_country_created_at ON waitlist_entries (country, created_at);
CREATE INDEX CONCURRENTLY idx_waitlist_business_type_created_at ON waitlist_entries (type_of_business, created_at);

-- Composite index for admin filtering
CREATE INDEX CONCURRENTLY idx_waitlist_admin_filter ON waitlist_entries (status, email_verified, created_at DESC);

-- Partial indexes for specific queries
CREATE INDEX CONCURRENTLY idx_waitlist_unverified ON waitlist_entries (email_verification_sent_at) 
WHERE email_verified = false;
```

### Caching Strategy

```typescript
// backend/src/services/cacheService.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Cache waitlist statistics for 5 minutes
  async getWaitlistStats() {
    const cacheKey = 'waitlist:stats';
    let stats = await this.get(cacheKey);
    
    if (!stats) {
      stats = await this.calculateStats();
      await this.set(cacheKey, stats, 300); // 5 minutes
    }
    
    return stats;
  }

  private async calculateStats() {
    // Expensive database queries here
    // This would be called from WaitlistService
  }
}
```

### Frontend Optimization

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search component
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      searchWaitlistEntries(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search entries..."
    />
  );
};
```

## Security Best Practices

### Input Validation

```typescript
// backend/src/validators/waitlistValidator.ts
import Joi from 'joi';

export const waitlistEntrySchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  fullName: Joi.string().min(2).max(255).required(),
  phoneNumber: Joi.string().pattern(/^[\+]?[\d\s\-\(\)]+$/).min(10).max(20).required(),
  typeOfBusiness: Joi.string().valid(
    'Music Production',
    'Fashion & Apparel',
    'Digital Goods',
    'Art & Crafts',
    'Technology',
    'Food & Beverage',
    'Beauty & Cosmetics',
    'Jewelry & Accessories',
    'Home & Living',
    'Sports & Fitness',
    'Books & Media',
    'Other'
  ).required(),
  customBusinessTypes: Joi.when('typeOfBusiness', {
    is: 'Other',
    then: Joi.string().min(2).max(255).required(),
    otherwise: Joi.string().allow('', null)
  }),
  country: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  hasRunStoreBefore: Joi.boolean().default(false),
  wantsTutorialBook: Joi.boolean().default(false),
  utmSource: Joi.string().max(100).allow('', null),
  utmMedium: Joi.string().max(100).allow('', null),
  utmCampaign: Joi.string().max(100).allow('', null)
});

export const validateWaitlistEntry = (data: any) => {
  return waitlistEntrySchema.validate(data, { abortEarly: false });
};
```

### Authentication Middleware

```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token required'
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required'
      }
    });
  }

  next();
};
```

## Monitoring and Logging

### Logging Configuration

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'myzuwa-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export { logger };
```

### Health Checks

```typescript
// backend/src/routes/health.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const router = Router();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      redis: 'unknown',
      email: 'unknown'
    }
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'unhealthy';
  }

  // Check email service (implement based on your provider)
  health.services.email = 'healthy';

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

This comprehensive developer guide provides everything needed to understand, develop, and maintain the Myzuwa waitlist platform. It covers architecture, implementation details, testing strategies, deployment procedures, and best practices for security and performance.