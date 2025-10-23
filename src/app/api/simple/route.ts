import { NextResponse } from 'next/server';

// Absolutely minimal API - no imports from our codebase
export async function GET() {
  return NextResponse.json({
    status: 'working',
    message: 'Minimal API is functional',
    timestamp: new Date().toISOString(),
    runtime: 'netlify-function'
  });
}