import { NextRequest, NextResponse } from 'next/server';
import { getFromR2 } from '@/src/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];
    const key = pathSegments.join('/');

    if (!key) {
      return new NextResponse('Asset key is required', { status: 400 });
    }

    const item = await getFromR2(key);
    if (!item) {
      return new NextResponse('Media asset not found in R2 storage', { status: 404 });
    }

    return new NextResponse(item.body, {
      status: 200,
      headers: {
        'Content-Type': item.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000, immutable',
        'Cloudflare-CDN-Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('[MEDIA CDN ROUTE ERROR]:', error);
    return new NextResponse('Error loading media asset', { status: 500 });
  }
}

