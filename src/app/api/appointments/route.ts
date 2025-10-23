import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause: any = {};

    if (decoded.role === 'PATIENT') {
      whereClause.patientId = decoded.userId;
      // For patients, only show future appointments by default
      whereClause.startTime = {
        gte: new Date()
      };
    }

    if (status) {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        service: true,
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialties: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json({ appointments });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const body = await request.json();
    
    const { serviceId, providerId, appointmentDate, appointmentTime, notes } = body;

    // Validate required fields
    if (!serviceId || !providerId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Service, provider, date, and time are required' },
        { status: 400 }
      );
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Create appointment date-time
    const appointmentStart = new Date(`${appointmentDate}T${appointmentTime}`);
    const appointmentEnd = new Date(appointmentStart.getTime() + service.duration * 60000); // Add duration in minutes

    // Check for conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        providerId,
        startTime: {
          lte: appointmentEnd
        },
        endTime: {
          gte: appointmentStart
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: decoded.userId,
        serviceId,
        providerId,
        startTime: appointmentStart,
        endTime: appointmentEnd,
        status: 'PENDING',
        notes: notes || '',
        totalAmount: service.price
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        service: true,
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialties: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment
    }, { status: 201 });

  } catch (error) {
    console.error('Create appointment error:', error);
    if (error instanceof Error && error.message === 'No token provided') {
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