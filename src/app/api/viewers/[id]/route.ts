import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyAuth(req: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth failed: No Authorization header or not Bearer format');
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Auth failed: Token is empty');
      return false;
    }
    
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
    );
    return true;
  } catch (error) {
    console.error('Auth failed: Token verification error:', error);
    return false;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - Proper authentication token required' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Viewer ID is required' },
        { status: 400 }
      );
    }
    
    const viewer = await prisma.stateViewers.findUnique({
      where: { id }
    });
    
    if (!viewer) {
      return NextResponse.json(
        { error: 'Viewer not found' },
        { status: 404 }
      );
    }
    
    await prisma.stateViewers.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Viewer deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting viewer:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
