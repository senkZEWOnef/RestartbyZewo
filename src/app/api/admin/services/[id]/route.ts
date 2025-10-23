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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminToken(request);
    const body = await request.json();
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;

    const { name, description, duration, price, category, isActive } = body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      return NextResponse.json(
        { error: 'Duration must be a positive number' },
        { status: 400 }
      );
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(duration && { duration }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    console.error('Update service error:', error);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdminToken(request);
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if service is used in any appointments
    const appointmentCount = await prisma.appointment.count({
      where: { serviceId }
    });

    if (appointmentCount > 0) {
      // If service is used in appointments, just deactivate it instead of deleting
      const deactivatedService = await prisma.service.update({
        where: { id: serviceId },
        data: { isActive: false }
      });

      return NextResponse.json({
        message: 'Service deactivated (cannot delete services with existing appointments)',
        service: deactivatedService
      });
    }

    // If no appointments, safe to delete
    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    
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