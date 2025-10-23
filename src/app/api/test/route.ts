import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      hasJWT: !!process.env.JWT_SECRET
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: 'Test API failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}