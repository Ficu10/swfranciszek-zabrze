import { NextResponse } from 'next/server';

export function GET() {
  console.error('[NOT_FOUND] 404 - Route not found');
  return NextResponse.json(
    { error: 'Not Found', message: 'The requested route was not found' },
    { status: 404 }
  );
}
