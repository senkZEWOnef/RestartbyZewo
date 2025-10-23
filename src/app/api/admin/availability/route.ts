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

    // Get the provider (Dr. Acevedo) - should be the only one in our setup
    const provider = await prisma.provider.findFirst({
      where: { isActive: true }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const availability = await prisma.availability.findMany({
      where: {
        providerId: provider.id,
        active: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json({ availability, providerId: provider.id });

  } catch (error) {
    console.error('Get availability error:', error);
    
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

    const { dayOfWeek, startTime, endTime, providerId } = body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime || !providerId) {
      return NextResponse.json(
        { error: 'Day of week, start time, end time, and provider ID are required' },
        { status: 400 }
      );
    }

    // Validate day of week (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: 'Day of week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      );
    }

    // Check for overlapping slots
    const existingSlot = await prisma.availability.findFirst({
      where: {
        providerId,
        dayOfWeek,
        active: true,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    if (existingSlot) {
      return NextResponse.json(
        { error: 'This time slot overlaps with an existing availability slot' },
        { status: 409 }
      );
    }

    const availability = await prisma.availability.create({
      data: {
        providerId,
        dayOfWeek,
        startTime,
        endTime,
        active: true
      }
    });

    return NextResponse.json({
      message: 'Availability slot created successfully',
      availability
    }, { status: 201 });

  } catch (error) {
    console.error('Create availability error:', error);
    
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