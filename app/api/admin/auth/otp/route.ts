import { NextResponse } from 'next/server';
import { generateAdminOtp } from '@/src/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const res = await generateAdminOtp(email);
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: res.message,
      // Pass code in response for direct, friction-free login during demonstration / sprint verification
      otp: res.otp
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
