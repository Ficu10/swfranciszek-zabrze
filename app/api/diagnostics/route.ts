import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[DIAGNOSTICS] Diagnostic endpoint called');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET - THIS IS THE PROBLEM!',
    database: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
  };

  if (!process.env.NEXTAUTH_SECRET) {
    console.error('[DIAGNOSTICS] ❌ CRITICAL: NEXTAUTH_SECRET is missing!');
    diagnostics.nextAuthUrl = 'NEXTAUTH_SECRET missing - app cannot start';
  }
  
  if (!process.env.NEXTAUTH_URL) {
    console.error('[DIAGNOSTICS] ❌ CRITICAL: NEXTAUTH_URL is missing!');
    diagnostics.nextAuthUrl = 'NEXTAUTH_URL missing - app cannot start';
  }

  if (!process.env.DATABASE_URL) {
    console.error('[DIAGNOSTICS] ⚠️  WARNING: DATABASE_URL is missing!');
  }

  return NextResponse.json(diagnostics);
}
