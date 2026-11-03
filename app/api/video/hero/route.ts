import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const device = searchParams.get('device') === 'mobile' ? 'mobile' : 'desktop';
  const target = device === 'mobile' ? '/assets/mobile_view_part0.bin' : '/assets/desktop_view_part0.bin';
  return NextResponse.redirect(new URL(target, req.url), 307);
}
