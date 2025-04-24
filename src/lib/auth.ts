import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
    ) as { userId: string; email: string };
    
    return decoded;
  } catch (error) {
    return null;
  }
}
