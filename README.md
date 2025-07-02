# Myzuwa Waitlist Platform

A modern, full-featured waitlist application with a comprehensive admin panel for managing e-commerce and music platform launches. Built with React (frontend) and Laravel PHP (backend), fully compatible with InfinityFree and similar PHP/MySQL hosts.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-step Waitlist Form**: Email capture → Details collection → Success confirmation
- **Real-time Validation**: Client-side form validation with user-friendly error messages
- **Dynamic Content**: All text content manageable through admin panel
- **Social Proof**: Configurable social proof elements and statistics
- **Footer Management**: Customizable footer with social links and legal pages

### Admin Panel Features
- **Dashboard Analytics**: Real-time statistics and data visualization
- **Waitlist Management**: View, filter, search, delete (single/bulk), and export waitlist entries
- **Content Management**: Edit all frontend text content dynamically
- **Site Settings**: Configure SEO, social media, email, Gemini API, and more
- **User Management**: Secure admin authentication
- **Data Export**: CSV export functionality for waitlist data
- **Gemini AI Security Agent**: Chat with Gemini for security/compliance
- **Logo & Social Media Management**: Upload logo, manage social links
- **Confirmation Email Management**: Customizable confirmation email message
- **Responsive Design**: Mobile-friendly admin interface

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Context API** for state management

### Backend
- **Laravel 10+** (PHP 8.3+)
- **Eloquent ORM** for database access
- **MySQL 8.0+** (or MariaDB 10.6+)
- **Laravel Auth** for authentication
- **Laravel Mail** for email/confirmation
- **Gemini API** for AI-powered admin security agent
- **Rate limiting, validation, and security best practices**

### Database
- **MySQL 8.0+** (InfinityFree or compatible host)
- Schema defined in [`database/myzuwa_schema.sql`](./backend-laravel/database/myzuwa_schema.sql)

## 📁 Project Structure

```
myzuwa-waitlist/
├── src/
│   ├── components/           # React components
│   │   ├── admin/           # Admin panel components
│   │   ├── EmailCapture.tsx # Email collection form
│   │   ├── WaitlistForm.tsx # Detailed waitlist form
│   │   ├── SuccessMessage.tsx # Success confirmation
│   │   └── Footer.tsx       # Site footer
│   ├── contexts/            # React contexts
│   │   ├── ContentContext.tsx # Content management
│   │   └── SettingsContext.tsx # Site settings
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── data/                # Static data (countries, etc.)
│   └── App.tsx              # Main application
├── backend-laravel/         # Laravel backend (API, migrations, etc.)
│   ├── database/            # SQL schema, migrations, seeders
│   └── ...
├── docs/                    # Documentation
├── public/                  # Static assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+ and Composer (for backend)
- Node.js 18+ and npm (for frontend build)
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/myzuwa-waitlist.git
cd myzuwa-waitlist
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend-laravel
composer install
```

4. **Set up the database**
- Create a MySQL database (use InfinityFree or your host's control panel)
- Import [`database/myzuwa_schema.sql`](./backend-laravel/database/myzuwa_schema.sql) using phpMyAdmin
- Copy `.env.example` to `.env` and update DB credentials, SSL, and Gemini API key
- Run migrations (if needed):
```bash
php artisan migrate
```

5. **Start development servers**
- **Backend:**
```bash
php artisan serve
```
- **Frontend:**
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- Admin Credentials: (set in DB or via seeder)

### Build for Production
```bash
npm run build
npm run preview
```

## 📊 Data Models

See [Database Schema Documentation](./docs/DATABASE.md) and [`database/myzuwa_schema.sql`](./backend-laravel/database/myzuwa_schema.sql) for detailed information.

## 🔧 API Documentation

See [API Documentation](./docs/API.md) for backend endpoints and integration details.

## 🎨 Customization

### Content Management
All frontend content can be managed through the admin panel:
- Navigate to `/admin/dashboard`
- Use the Content Management section to edit text, labels, and messages
- Changes are applied immediately

### Styling
- Modify `tailwind.config.js` for theme customization
- Update CSS custom properties in the Settings panel
- All colors and themes are configurable through the admin interface

## 🔐 Security

- Admin authentication with session management (Laravel Auth)
- Rate limiting on form submissions (Laravel middleware)
- Input validation and sanitization (Laravel validation)
- CSRF protection (Laravel)
- Secure password hashing (bcrypt)
- SSL support for frontend and MySQL (see `.env`)

## 📈 Analytics & Monitoring

The platform supports integration with:
- Google Analytics
- Facebook Pixel
- Hotjar
- Custom analytics solutions

Configure tracking IDs in the admin settings panel.

## 🚀 Deployment

### Frontend Deployment
- Build with `npm run build` and upload `dist/` to InfinityFree or any static host

### Backend Deployment
- Upload `backend-laravel` to InfinityFree (or compatible PHP host)
- Set up `.env` with DB, mail, Gemini API key, and SSL options
- Import `myzuwa_schema.sql` using phpMyAdmin
- Run `composer install` and `php artisan migrate` on the server
- Set correct permissions for `storage` and `bootstrap/cache`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@myzuwa.com
- Documentation: [docs/](./docs/)

## 🗺 Roadmap

- [x] Backend API implementation (Laravel)
- [x] Database integration (MySQL, see `myzuwa_schema.sql`)
- [x] Email automation (confirmation email)
- [x] Gemini AI-powered admin security agent
- [x] Logo upload and social media management
- [x] Advanced analytics
- [ ] Multi-language support
- [ ] A/B testing framework
- [ ] Mobile app companion

---

**Made with ❤️ for creators, artists, and entrepreneurs**