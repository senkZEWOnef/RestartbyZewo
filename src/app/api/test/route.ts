import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check all environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'set' : 'missing'
    };

    return NextResponse.json({
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      platform: process.platform,
      nodeVersion: process.version
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: 'Test API failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}