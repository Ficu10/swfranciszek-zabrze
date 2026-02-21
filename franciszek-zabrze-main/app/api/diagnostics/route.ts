import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[DIAGNOSTICS] Diagnostic endpoint called');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
    nodeVersion: process.version,
  };

  console.log('[DIAGNOSTICS] Environment variables:', diagnostics);

  if (!process.env.NEXTAUTH_SECRET) {
    console.error('[DIAGNOSTICS] ERROR: NEXTAUTH_SECRET is not set!');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    console.error('[DIAGNOSTICS] ERROR: NEXTAUTH_URL is not set!');
  }

  if (!process.env.DATABASE_URL) {
    console.error('[DIAGNOSTICS] ERROR: DATABASE_URL is not set!');
  }

  return NextResponse.json(diagnostics);
}
