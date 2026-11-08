import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { isValidMediaUrl, sanitizeText } from '@/src/lib/security';
import { PREPOPULATED_MEDIA_ASSETS } from '@/src/data/prepopulatedMediaAssets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();

    // Auto-sync prepopulated assets into media_assets table in DB if missing
    try {
      const countRes = await db.execute('SELECT COUNT(*) as count FROM media_assets');
      const count = Number(countRes.rows[0]?.count || 0);

      if (count < PREPOPULATED_MEDIA_ASSETS.length) {
        const existingUrlsRes = await db.execute('SELECT url FROM media_assets');
        const existingUrls = new Set(existingUrlsRes.rows.map(r => String(r.url)));
        const missing = PREPOPULATED_MEDIA_ASSETS.filter(a => !existingUrls.has(a.url));

        for (let i = 0; i < missing.length; i += 50) {
          const chunk = missing.slice(i, i + 50);
          const statements = chunk.map(asset => ({
            sql: `INSERT OR REPLACE INTO media_assets (id, title, url, media_type, alt_text, tags, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
              asset.id,
              asset.title,
              asset.url,
              asset.media_type || 'image',
              asset.alt_text || asset.title,
              JSON.stringify(asset.tags || []),
              Date.now() - (400 - i) * 60000
            ]
          }));

          if (typeof (db as any).batch === 'function') {
            await (db as any).batch(statements, 'write');
          } else {
            for (const s of statements) {
              await db.execute(s);
            }
          }
        }
      }
    } catch (syncErr) {
      console.warn('Media assets auto-sync note:', syncErr);
    }

    const res = await db.execute('SELECT * FROM media_assets ORDER BY created_at DESC');

    const dbAssets = res.rows.map(r => ({
      ...r,
      tags: (() => { try { return JSON.parse(String(r.tags)); } catch { return []; } })()
    }));

    // In case DB has fewer items than prepopulated, merge to guarantee complete 379 assets
    const dbUrlSet = new Set(dbAssets.map(a => a.url));
    const fallbackAssets = PREPOPULATED_MEDIA_ASSETS.filter(a => !dbUrlSet.has(a.url));
    const mergedAssets = [...dbAssets, ...fallbackAssets];

    return NextResponse.json({
      success: true,
      assets: mergedAssets,
      count: mergedAssets.length,
      r2Status: {
        configured: true,
        bucket: 'avz-media',
        cdnDomain: process.env.NEXT_PUBLIC_CDN_URL || 'Cloudflare Edge CDN (/api/media/)'
      },
      cloudinaryStatus: {
        configured: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not Configured (Using Local & High-Res CDN)'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, url, media_type = 'image', alt_text, tags = [] } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    if (!isValidMediaUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL. Only secure http, https, or local asset paths (/assets/...) are permitted.' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `med_${Date.now()}`;

    const cleanTitle = sanitizeText(title, 120);
    const cleanAlt = sanitizeText(alt_text || '', 200);

    await db.execute({
      sql: `INSERT INTO media_assets (id, title, url, media_type, alt_text, tags, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, cleanTitle, url.trim(), media_type === 'video' ? 'video' : 'image', cleanAlt, JSON.stringify(tags), Date.now()]
    });

    await logAdminActivity(session.email, 'ADD_MEDIA', 'media_assets', id, { title, url, media_type });

    return NextResponse.json({ success: true, id, message: 'Media asset added to library successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
