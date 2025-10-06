# AdminKit Pro - Multi-Module Enterprise Dashboard

A comprehensive, modern, and professional admin dashboard built with Next.js 15, React 19, TypeScript, and ShadCN UI. This enterprise-grade solution provides a modular architecture for managing users, products, orders, media files, reports, and system settings.

## 🚀 Features

### Core Modules
- **Dashboard** - KPI cards, analytics charts, and activity feed
- **User Management** - Complete CRUD operations with role-based access control
- **Product Management** - Catalog management with inventory tracking
- **Order Management** - Order processing and status tracking
- **Media Library** - File upload and management system
- **Reports & Analytics** - Comprehensive reporting with data visualization
- **Settings** - System configuration and preferences

### Technical Features
- **Modern Stack** - Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components** - ShadCN UI with Radix UI primitives
- **Authentication** - JWT-based authentication with role-based access
- **Database** - MySQL with connection pooling
- **Responsive Design** - Mobile-first, fully responsive layout
- **Dark Mode** - Built-in theme switching
- **Form Validation** - Zod schema validation with React Hook Form
- **Data Visualization** - Recharts for analytics and reporting
- **Type Safety** - Full TypeScript coverage

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Database**: MySQL 8.0+
- **Authentication**: JWT (jsonwebtoken)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adminkit-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=adminkit_pro_db

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key

   # Base URL of your application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   Run the SQL script provided in the project to create the database schema:
   ```sql
   CREATE DATABASE adminkit_pro_db;
   USE adminkit_pro_db;
   
   -- Run the complete SQL schema from the project
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `media_library` - File management
- `settings` - System configuration
- `activity_logs` - Audit trail

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control:

- **SUPER_ADMIN** - Full system access
- **ADMIN** - Administrative access to most modules
- **CUSTOMER** - Limited access (for future customer portal)

### Default Credentials
- Email: `admin@example.com`
- Password: `password123`

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Theming

The application supports both light and dark themes with:
- System preference detection
- Manual theme switching
- Persistent theme selection
- Custom color schemes

## 📊 Modules Overview

### Dashboard
- Real-time KPI cards
- Interactive analytics charts
- Recent activity feed
- Quick action buttons

### User Management
- User CRUD operations
- Role assignment
- Search and filtering
- Bulk operations

### Product Management
- Product catalog
- Inventory tracking
- Image management
- Stock alerts

### Order Management
- Order processing
- Status tracking
- Customer information
- Order details view

### Media Library
- File upload
- Image preview
- File management
- URL copying

### Reports & Analytics
- Sales reports
- User analytics
- Product performance
- Export functionality

### Settings
- System configuration
- Theme settings
- Security options
- Advanced preferences

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS
- Google Cloud

## 🔧 Configuration

### Environment Variables
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `NEXT_PUBLIC_APP_URL` - Application URL

### Database Configuration
Update the database connection settings in `src/lib/database.ts` if needed.

## 📈 Performance

The application is optimized for performance with:
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading
- Connection pooling

## 🛡️ Security

Security features include:
- JWT authentication
- Password hashing (bcrypt)
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics
- API documentation
- Mobile app
- Multi-language support
- Advanced reporting
- Integration with external services

---

Built with ❤️ using Next.js, React, and TypeScript.