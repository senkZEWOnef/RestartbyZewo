import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Step 1: Test basic function execution
    const basicInfo = {
      message: 'Basic API working',
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version,
      env: process.env.NODE_ENV
    };

    // Step 2: Test environment variables (most common issue)
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'exists' : 'missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing'
    };

    // Step 3: Test dynamic import of Prisma (common failure point)
    let prismaStatus = 'not_tested';
    try {
      // Use dynamic import to catch import errors
      const prismaModule = await import('@/lib/prisma');
      prismaStatus = 'imported_successfully';
    } catch (importError) {
      prismaStatus = `import_failed: ${importError instanceof Error ? importError.message : 'unknown_error'}`;
    }

    return NextResponse.json({
      status: 'success',
      basicInfo,
      envVars,
      prismaStatus,
      debug: 'All checks completed'
    });

  } catch (topLevelError) {
    // Catch ANY error and return detailed info
    console.error('Debug API top-level error:', topLevelError);
    
    return NextResponse.json({
      status: 'error',
      error: topLevelError instanceof Error ? topLevelError.message : 'Unknown error',
      stack: topLevelError instanceof Error ? topLevelError.stack : undefined,
      name: topLevelError instanceof Error ? topLevelError.name : undefined,
      debug: 'Error caught at top level'
    }, { status: 500 });
  }
}