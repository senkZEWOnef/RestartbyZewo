import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    return NextResponse.json({ providers });

  } catch (error) {
    console.error('Get providers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, specialties, bio } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || '',
        specialties: specialties || [],
        bio: bio || '',
        isActive: true
      }
    });

    return NextResponse.json({
      message: 'Provider created successfully',
      provider
    }, { status: 201 });

  } catch (error) {
    console.error('Create provider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}