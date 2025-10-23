import { NextResponse } from 'next/server';

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    tests: {} as any
  };

  try {
    // Test 1: Environment check
    testResults.tests.environment = {
      status: 'pass',
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET
    };

    // Test 2: Try to import safe prisma
    try {
      const { getSafePrisma } = await import('@/lib/safe-prisma');
      testResults.tests.prismaImport = { status: 'pass', message: 'Safe Prisma imported successfully' };

      // Test 3: Try to connect to database
      if (process.env.DATABASE_URL) {
        try {
          const prisma = await getSafePrisma();
          const result = await prisma.$queryRaw`SELECT 1 as test`;
          testResults.tests.databaseConnection = { 
            status: 'pass', 
            message: 'Database connected successfully',
            result 
          };
        } catch (dbError) {
          testResults.tests.databaseConnection = { 
            status: 'fail', 
            error: dbError instanceof Error ? dbError.message : 'Database connection failed' 
          };
        }
      } else {
        testResults.tests.databaseConnection = { 
          status: 'skip', 
          message: 'No DATABASE_URL provided' 
        };
      }

    } catch (importError) {
      testResults.tests.prismaImport = { 
        status: 'fail', 
        error: importError instanceof Error ? importError.message : 'Prisma import failed' 
      };
    }

    return NextResponse.json({
      status: 'completed',
      ...testResults
    });

  } catch (error) {
    console.error('DB test error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ...testResults
    }, { status: 500 });
  }
}