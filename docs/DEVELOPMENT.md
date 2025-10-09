# AdminKit Pro - Development Guide

This document provides guidelines and best practices for developing and extending the AdminKit Pro application.

## Development Environment Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn
- Git

### Initial Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd adminkit-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
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

4. Set up the database:
   ```bash
   mysql -u root -p < database-setup.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

The application follows a modular structure based on Next.js App Router conventions:

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

## Coding Standards

### TypeScript
- Use TypeScript for all new components and modules
- Define interfaces for all props and state
- Use strict typing wherever possible
- Leverage TypeScript's type inference when appropriate

### Component Structure
- Use functional components with hooks
- Implement proper error handling
- Use meaningful component names
- Break down complex components into smaller, reusable ones
- Follow the single responsibility principle

### File Naming
- Use kebab-case for file names
- Use PascalCase for component files
- Use descriptive names that reflect the component's purpose

### Styling
- Use Tailwind CSS classes for styling
- Leverage ShadCN UI components when possible
- Maintain consistency with the existing design system
- Use CSS variables for theme-related values

## Adding New Features

### 1. Create New Module

To add a new module to the dashboard:

1. Create a new directory in `src/app/dashboard/`:
   ```bash
   mkdir src/app/dashboard/new-module
   ```

2. Create the main page file:
   ```bash
   touch src/app/dashboard/new-module/page.tsx
   ```

3. Add the API routes in `src/app/api/new-module/`:
   ```bash
   mkdir src/app/api/new-module
   touch src/app/api/new-module/route.ts
   ```

4. Update the navigation in `src/components/layout/sidebar.tsx`

5. Add necessary types in `src/lib/types.ts`

6. Add validation schemas in `src/lib/validations.ts`

### 2. Database Changes

To modify the database schema:

1. Update the `database-setup.sql` file with new tables or columns
2. Create migration scripts if needed
3. Update the TypeScript types in `src/lib/types.ts`
4. Update the database connection code in `src/lib/database.ts` if necessary

### 3. API Endpoints

When creating new API endpoints:

1. Follow the existing patterns in `src/app/api/`
2. Use proper HTTP methods (GET, POST, PUT, DELETE)
3. Implement proper error handling
4. Use middleware for authentication when needed
5. Validate input data using Zod schemas
6. Return appropriate HTTP status codes

### 4. UI Components

When creating new UI components:

1. Check if an existing ShadCN UI component can be used
2. Create new components in the appropriate directory under `src/components/`
3. Use TypeScript interfaces for props
4. Implement proper accessibility features
5. Add necessary styling with Tailwind CSS
6. Write unit tests for complex components

## State Management

### Context API
The application uses React's Context API for state management:

- `AuthContext` - Authentication state
- `CartContext` - Shopping cart state
- `WishlistContext` - Wishlist state
- `OrdersContext` - Orders state
- `PaymentMethodsContext` - Payment methods state

### When to Use Context
- Data that needs to be accessed by multiple components
- Data that changes infrequently
- Global application state

### When NOT to Use Context
- Data that changes frequently
- Data that is only used by one or two components
- Complex state that requires middleware

## Authentication

### Protected Routes
Use the `ProtectedRoute` component to protect pages that require authentication:

```tsx
import ProtectedRoute from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Authentication Hooks
Use the `useAuth` hook to access authentication state:

```tsx
import { useAuth } from '@/lib/auth-context';

export default function UserProfile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Data Fetching

### Server Components
Use Server Components for data fetching when possible:

```tsx
export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Client Components
Use Client Components when you need interactivity:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function InteractiveComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### API Calls
Use the built-in `fetch` API for client-side data fetching:

```tsx
async function fetchProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}
```

## Form Handling

### React Hook Form
Use React Hook Form for form handling:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations';

export default function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });
  
  const onSubmit = (data) => {
    // Handle form submission
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <p>{form.formState.errors.name.message}</p>
      )}
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Validation
Use Zod for schema validation:

```ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});
```

## Error Handling

### API Error Handling
Implement proper error handling in API routes:

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data
    const validatedData = userSchema.parse(data);
    
    // Process data
    const user = await createUser(validatedData);
    
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', message: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

### Client-Side Error Handling
Handle errors in components:

```tsx
'use client';

import { useState } from 'react';

export default function DataComponent() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Testing

### Unit Testing
Use Jest for unit testing:

```ts
import { validateEmail } from '@/lib/utils';

describe('validateEmail', () => {
  it('should return true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  it('should return false for invalid emails', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### Component Testing
Use React Testing Library for component testing:

```tsx
import { render, screen } from '@testing-library/react';
import UserCard from '@/components/user-card';

describe('UserCard', () => {
  it('should display user name', () => {
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting
Use dynamic imports for code splitting:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'));

export default function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

### Image Optimization
Use Next.js Image component for image optimization:

```tsx
import Image from 'next/image';

export default function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      layout="responsive"
    />
  );
}
```

### Caching
Implement caching strategies where appropriate:

```ts
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  // Fetch user from database
  const user = await db.user.findUnique({ where: { id } });
  return user;
});
```

## Security Best Practices

### Input Validation
Always validate and sanitize user input:

```ts
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function createUser(data: unknown) {
  const validatedData = userSchema.parse(data);
  // Process validated data
}
```

### Authentication
- Use JWT tokens for authentication
- Hash passwords with bcrypt
- Implement proper session management
- Use HTTPS in production

### SQL Injection Prevention
Use parameterized queries:

```ts
// Good - Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.execute(query, [userId]);

// Bad - String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

## Deployment

### Environment Variables
Set environment variables in your deployment platform:

- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `NEXT_PUBLIC_APP_URL` - Application URL

### Build Process
The application uses Next.js's build system:

```bash
npm run build
npm start
```

### CI/CD
Set up continuous integration and deployment pipelines:

1. Run tests on every commit
2. Build and deploy on successful tests
3. Monitor application performance
4. Implement rollback strategies

## Troubleshooting

### Common Development Issues

1. **TypeScript Errors**
   - Check type definitions in `src/lib/types.ts`
   - Ensure all props are properly typed
   - Use `any` sparingly and only as a last resort

2. **Styling Issues**
   - Check Tailwind CSS classes
   - Verify responsive breakpoints
   - Inspect CSS specificity conflicts

3. **API Route Issues**
   - Check HTTP methods
   - Verify request/response formats
   - Test with tools like Postman

4. **Database Connection Issues**
   - Verify environment variables
   - Check database credentials
   - Ensure MySQL is running

### Debugging Tips

1. Use browser developer tools
2. Check network requests in dev tools
3. Use console.log statements sparingly
4. Implement proper error logging
5. Use React DevTools for component debugging

## Contributing

### Git Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Commit your changes
6. Push to your fork
7. Create a pull request

### Code Review Process
1. All pull requests must be reviewed
2. Tests must pass before merging
3. Code must follow established patterns
4. Documentation must be updated

### Commit Messages
Use conventional commit messages:
- `feat: Add new feature`
- `fix: Resolve bug`
- `docs: Update documentation`
- `refactor: Improve code structure`
- `test: Add tests`
- `chore: Update dependencies`

## Future Development

### Planned Improvements
1. Implement real-time notifications with WebSockets
2. Add advanced search functionality
3. Implement caching strategies
4. Add comprehensive test coverage
5. Improve accessibility compliance
6. Add internationalization support
7. Implement advanced analytics
8. Add API documentation with Swagger

### Scalability Considerations
1. Database connection pooling
2. API rate limiting
3. Caching strategies
4. Load balancing
5. Microservice architecture (for future expansion)