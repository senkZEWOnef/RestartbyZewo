import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    platform: process.platform,
    nodeVersion: process.version,
    database: {
      status: 'unknown',
      url: process.env.DATABASE_URL ? 'configured' : 'missing',
      error: null as string | null
    },
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL
    }
  };

  try {
    // Only test database if URL is available
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('@/lib/prisma');
        await prisma.$queryRaw`SELECT 1`;
        healthCheck.database.status = 'connected';
      } catch (dbError) {
        healthCheck.database.status = 'error';
        healthCheck.database.error = dbError instanceof Error ? dbError.message : 'Database connection failed';
      }
    } else {
      healthCheck.database.status = 'no_url';
      healthCheck.database.error = 'DATABASE_URL not configured';
    }
    
    healthCheck.status = healthCheck.database.status === 'connected' ? 'ok' : 'degraded';
    
    return NextResponse.json(healthCheck, {
      status: healthCheck.status === 'ok' ? 200 : 503
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    healthCheck.status = 'error';
    healthCheck.database.status = 'error';
    healthCheck.database.error = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(healthCheck, { status: 500 });
  }
}