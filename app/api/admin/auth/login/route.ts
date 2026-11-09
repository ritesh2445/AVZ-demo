import { NextResponse } from 'next/server';
import { loginAdminWithPassword } from '@/src/lib/auth';
import { getClientIp, checkRateLimit } from '@/src/lib/security';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // Brute-force defense: Max 5 login attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`admin_login_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many failed login attempts. Access is locked. Please try again in ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Account-specific rate check: Max 5 attempts per 15 minutes per email address
    const emailKey = `admin_login_email_${String(email).trim().toLowerCase()}`;
    const emailRateCheck = checkRateLimit(emailKey, 5, 15 * 60 * 1000);
    if (!emailRateCheck.allowed) {
      return NextResponse.json(
        { error: `Account temporarily locked due to excessive authentication attempts. Please try again later or use OTP.` },
        { status: 429 }
      );
    }

    const res = await loginAdminWithPassword(email, password);
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 401 });
    }

    // 2FA Challenge: Respond with requires2FA so client prompts for 6-digit code
    if (res.requires2FA) {
      return NextResponse.json({
        success: true,
        requires2FA: true,
        email: res.email,
        message: res.message,
        emailDispatched: res.emailDispatched,
        otp: res.otp
      });
    }

    if (!res.token || !res.session) {
      return NextResponse.json({ error: 'Authentication could not be completed.' }, { status: 401 });
    }

    const isLocalhost =
      request.headers.get('host')?.includes('localhost') ||
      request.headers.get('host')?.includes('127.0.0.1');

    const response = NextResponse.json({
      success: true,
      message: res.message,
      session: res.session,
      token: res.token,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'avz_admin_session',
      value: res.token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
