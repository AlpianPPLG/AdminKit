# AdminKit Pro - Setup Guide

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd adminkit-dashboard
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=adminkit_pro_db

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key_here

   # Base URL of your application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Database Setup**
   ```bash
   # Run the SQL script to create database and tables
   mysql -u root -p < database-setup.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open http://localhost:3000 in your browser

## Default Login Credentials

- **Email**: admin@example.com
- **Password**: password123

## Features Overview

### ✅ Completed Modules

1. **Dashboard** - KPI cards, analytics charts, activity feed
2. **User Management** - CRUD operations with role-based access
3. **Product Management** - Catalog management with inventory
4. **Order Management** - Order processing and status tracking
5. **Media Library** - File upload and management
6. **Reports & Analytics** - Data visualization and reporting
7. **Settings** - System configuration

### 🎨 UI/UX Features

- Modern, professional design
- Fully responsive (mobile, tablet, desktop)
- Dark/Light theme support
- Smooth animations and transitions
- Accessible components
- Clean, intuitive navigation

### 🔧 Technical Features

- Next.js 15 with App Router
- React 19 with TypeScript
- ShadCN UI components
- MySQL database with connection pooling
- JWT authentication
- Form validation with Zod
- Data visualization with Recharts
- Real-time updates

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   └── auth/             # Authentication components
└── lib/                  # Utilities and configurations
    ├── auth.ts           # Authentication utilities
    ├── database.ts       # Database connection
    ├── types.ts          # TypeScript types
    └── validations.ts    # Zod schemas
```

## Database Schema

The application uses 7 main tables:
- `users` - User accounts and roles
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `media_library` - File management
- `settings` - System configuration
- `activity_logs` - Audit trail

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/[id]` - Get order by ID
- `PUT /api/orders/[id]` - Update order

### Media
- `GET /api/media` - Get all media files
- `POST /api/media` - Upload file
- `GET /api/media/[id]` - Get file by ID
- `DELETE /api/media/[id]` - Delete file

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update setting

## Customization

### Adding New Modules

1. Create new page in `src/app/dashboard/[module]/`
2. Add API routes in `src/app/api/[module]/`
3. Update navigation in `src/components/layout/sidebar.tsx`
4. Add types in `src/lib/types.ts`
5. Add validations in `src/lib/validations.ts`

### Theming

The application uses CSS variables for theming. Modify `src/app/globals.css` to customize colors and styles.

### Database

To add new tables or modify existing ones, update the SQL schema and run migrations.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env.local`
   - Ensure database exists

2. **Build Errors**
   - Run `npm run build` to check for TypeScript errors
   - Check ESLint configuration

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check user credentials in database

### Development Tips

- Use `npm run dev` for development
- Check browser console for errors
- Use React DevTools for debugging
- Monitor network requests in browser dev tools

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

- Netlify
- Railway
- DigitalOcean
- AWS
- Google Cloud

## Support

For issues and questions:
- Check the README.md
- Review code comments
- Create an issue in the repository

## License

MIT License - see LICENSE file for details.

