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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request);
    const body = await request.json();
    const availabilityId = params.id;

    const { dayOfWeek, startTime, endTime, active } = body;

    // Check if availability slot exists
    const existingSlot = await prisma.availability.findUnique({
      where: { id: availabilityId }
    });

    if (!existingSlot) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      );
    }

    // If updating times, check for overlaps (excluding current slot)
    if (dayOfWeek !== undefined && startTime && endTime) {
      const overlappingSlot = await prisma.availability.findFirst({
        where: {
          id: { not: availabilityId },
          providerId: existingSlot.providerId,
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

      if (overlappingSlot) {
        return NextResponse.json(
          { error: 'This time slot overlaps with an existing availability slot' },
          { status: 409 }
        );
      }
    }

    const updatedAvailability = await prisma.availability.update({
      where: { id: availabilityId },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(active !== undefined && { active })
      }
    });

    return NextResponse.json({
      message: 'Availability slot updated successfully',
      availability: updatedAvailability
    });

  } catch (error) {
    console.error('Update availability error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request);
    const availabilityId = params.id;

    // Check if availability slot exists
    const existingSlot = await prisma.availability.findUnique({
      where: { id: availabilityId }
    });

    if (!existingSlot) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      );
    }

    await prisma.availability.delete({
      where: { id: availabilityId }
    });

    return NextResponse.json({
      message: 'Availability slot deleted successfully'
    });

  } catch (error) {
    console.error('Delete availability error:', error);
    
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