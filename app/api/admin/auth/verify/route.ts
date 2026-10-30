import { NextResponse } from 'next/server';
import { verifyAdminOtp } from '@/src/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const res = await verifyAdminOtp(email, code);
    if (!res.success || !res.token || !res.session) {
      return NextResponse.json({ error: res.message }, { status: 401 });
    }

    const isLocalhost = request.headers.get('host')?.includes('localhost') || request.headers.get('host')?.includes('127.0.0.1');

    const response = NextResponse.json({
      success: true,
      message: res.message,
      session: res.session,
      token: res.token
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'avz_admin_session',
      value: res.token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
