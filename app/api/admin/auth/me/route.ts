import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session
  });
}
