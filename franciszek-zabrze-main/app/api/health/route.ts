import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[HEALTHCHECK] Health check endpoint called');
  
  return NextResponse.json({
    status: 'healthy',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
}
