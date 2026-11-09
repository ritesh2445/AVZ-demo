import { NextResponse } from 'next/server';
import { generateAdminOtp } from '@/src/lib/auth';
import { getClientIp, checkRateLimit, sanitizeText } from '@/src/lib/security';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`admin_otp_req_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many 2FA code requests. Please wait ${rateCheck.resetInSeconds} seconds before requesting another code.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cleanEmail = sanitizeText(email, 120).trim().toLowerCase();
    const res = await generateAdminOtp(cleanEmail);
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: res.message
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
