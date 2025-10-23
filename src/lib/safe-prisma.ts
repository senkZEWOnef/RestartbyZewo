// Safe Prisma client that won't crash if DATABASE_URL is missing
let prismaClient: any = null;

export async function getSafePrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (prismaClient) {
    return prismaClient;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
      errorFormat: 'minimal',
    });

    // Test the connection
    await prismaClient.$connect();
    
    return prismaClient;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function disconnectSafePrisma() {
  if (prismaClient) {
    try {
      await prismaClient.$disconnect();
      prismaClient = null;
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    }
  }
}