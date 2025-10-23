import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token and admin role
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  
  if (decoded.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  
  return decoded;
}

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request);

    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ services });

  } catch (error) {
    console.error('Get admin services error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Admin access required')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request);
    const body = await request.json();
    const { name, description, duration, price, category, isActive } = body;

    // Validate required fields
    if (!name || !duration || price === undefined) {
      return NextResponse.json(
        { error: 'Name, duration, and price are required' },
        { status: 400 }
      );
    }

    // Validate duration is a positive number
    if (typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json(
        { error: 'Duration must be a positive number' },
        { status: 400 }
      );
    }

    // Validate price is a non-negative number
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration,
        price,
        category: category || 'GENERAL',
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({
      message: 'Service created successfully',
      service
    }, { status: 201 });

  } catch (error) {
    console.error('Create admin service error:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Admin access required')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}