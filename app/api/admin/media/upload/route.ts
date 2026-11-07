import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { uploadToR2 } from '@/src/lib/r2';
import { sanitizeText } from '@/src/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';
    const customTitle = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided for upload' }, { status: 400 });
    }

    // Validate MIME type
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({
        error: `Unsupported file format (${file.type}). Allowed: JPG, PNG, WEBP, GIF, AVIF, SVG, MP4, WEBM`
      }, { status: 400 });
    }

    // Validate size (max 30MB)
    const MAX_SIZE = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum 30MB limit' }, { status: 400 });
    }

    // Clean filename and generate unique R2 key
    const rawName = file.name || 'image';
    const extension = rawName.split('.').pop()?.toLowerCase() || 'jpg';
    const baseSlug = rawName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 50);

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanFolder = folder.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'products';
    const r2Key = `${cleanFolder}/${baseSlug}_${uniqueId}.${extension}`;

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    const uploadResult = await uploadToR2(r2Key, buffer, file.type, {
      originalName: rawName,
      uploadedBy: session.email
    });

    // Save to media_assets table in Turso
    await initializeDatabase();
    const db = getDb();
    const mediaId = `med_${Date.now()}`;
    const mediaTitle = customTitle.trim() || baseSlug.replace(/_/g, ' ');
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    await db.execute({
      sql: `INSERT INTO media_assets (id, title, url, media_type, alt_text, tags, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        mediaId,
        sanitizeText(mediaTitle, 120),
        uploadResult.url,
        mediaType,
        sanitizeText(mediaTitle, 200),
        JSON.stringify([cleanFolder, 'r2-upload']),
        Date.now()
      ]
    });

    await logAdminActivity(session.email, 'UPLOAD_R2_MEDIA', 'media_assets', mediaId, {
      key: r2Key,
      url: uploadResult.url,
      size: file.size,
      media_type: mediaType
    });

    return NextResponse.json({
      success: true,
      media: {
        id: mediaId,
        title: mediaTitle,
        url: uploadResult.url,
        key: r2Key,
        media_type: mediaType,
        size: file.size,
        cdnSource: uploadResult.cdnSource
      },
      message: 'Media successfully uploaded to Cloudflare R2 & accelerated via Edge CDN'
    });
  } catch (error: any) {
    console.error('[ADMIN R2 UPLOAD API ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload media to R2' }, { status: 500 });
  }
}

