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

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get today's appointments
    const todayAppointments = await prisma.appointment.count({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    // Get total patients
    const totalPatients = await prisma.user.count({
      where: {
        role: 'PATIENT'
      }
    });

    // Get pending appointments
    const pendingAppointments = await prisma.appointment.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get this month's revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth
        },
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        service: {
          select: {
            name: true
          }
        }
      }
    });

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        toUser: {
          role: 'ADMIN'
        },
        isRead: false
      }
    });

    return NextResponse.json({
      stats: {
        todayAppointments,
        totalPatients,
        pendingAppointments,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        unreadMessages
      },
      recentAppointments
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    
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