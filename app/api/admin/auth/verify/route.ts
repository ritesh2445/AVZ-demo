import { NextResponse } from 'next/server';
import { verifyAdminOtp } from '@/src/lib/auth';
import { getClientIp, checkRateLimit, sanitizeText } from '@/src/lib/security';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // Brute-force defense against OTP guessing: Max 8 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`admin_verify_${clientIp}`, 8, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many 2FA verification attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and 2FA code are required' }, { status: 400 });
    }

    const cleanEmail = sanitizeText(email, 120).trim().toLowerCase();
    const cleanCode = sanitizeText(code, 10).trim();

    const res = await verifyAdminOtp(cleanEmail, cleanCode);
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
