import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || '6cadcaed14ea37a86b453f68cc06df639516283d443ca5c7626838fefdb9459e';

// Type assertion to tell TypeScript that JWT_SECRET is defined
const jwtSecret: string = JWT_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: '7d',
  });
}

// Verify JWT token (server-side)
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Decode token payload safely in the browser without verifying the signature
export function decodeToken(token: string): JWTPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// Extract token from request headers
export function extractTokenFromHeaders(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Check if user is admin
export function isAdmin(userRole: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
}

// Check if user is super admin
export function isSuperAdmin(userRole: string): boolean {
  return userRole === 'SUPER_ADMIN';
}
