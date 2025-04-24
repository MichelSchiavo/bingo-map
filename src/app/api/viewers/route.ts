import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

// Improved middleware to verify authentication
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

export async function GET(req: Request) {
  try {
    const viewers = await prisma.stateViewers.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const stateMap = new Map();
    
    viewers.forEach(viewer => {
      if (!stateMap.has(viewer.stateCode)) {
        stateMap.set(viewer.stateCode, {
          stateCode: viewer.stateCode,
          viewers: []
        });
      }
      
      stateMap.get(viewer.stateCode).viewers.push({
        id: viewer.id,
        viewerName: viewer.viewerName
      });
    });
    
    const results = Array.from(stateMap.values());
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching viewers:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAuthenticated = await verifyAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - Proper authentication token required' },
        { status: 401 }
      );
    }
    
    const { stateCode, viewerName } = await req.json();
    
    if (!stateCode || !viewerName) {
      return NextResponse.json(
        { error: 'State code and viewer name are required' },
        { status: 400 }
      );
    }
    
    const viewer = await prisma.stateViewers.create({
      data: {
        stateCode,
        viewerName
      }
    });
    
    return NextResponse.json(viewer, { status: 201 });
  } catch (error) {
    console.error('Error adding viewer:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
